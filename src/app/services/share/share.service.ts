import { Injectable } from '@angular/core';
import { Notification, NotificationsService } from '../notifications/notifications.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Observable, Subject, delay, from, map, of, switchMap, tap } from 'rxjs';

interface ShareLinkData {
  title: string, url: string
}

export type ShareServiceOptions = 'pdf' | 'img';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  OperationsOk = {status: 200};
  
  enableNativeShare = location.host.includes("https");

  constructor(private notify: NotificationsService) { }

  async shareLink(shareLinkdata: ShareLinkData) {
    if (this.enableNativeShare && navigator.canShare(shareLinkdata)) {
      var notification: Notification;
      try {
        await navigator.share(shareLinkdata);
        notification = {
          message: "Compartilhando...",
          type: 'info'
        };
      } catch (error: any) {
        notification = {
          message: error.message,
          type: 'error'
        };
        setTimeout(() => this.sendToClipboard(shareLinkdata), 5000);
      }
      this.notify.send(notification);
    } else {
      this.sendToClipboard(shareLinkdata);
    }
  }

  private sendToClipboard({ title, url }: ShareLinkData) {
    var button = document.createElement('button');
    var text = document.createElement('input');
    document.body.appendChild(text);
    document.body.appendChild(button);
    text.value = url;

    button.addEventListener('click', () => {
      if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(text);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        document.execCommand("copy");
        this.notify.send({
          message: `o link para  o '${title}' foi copiado para área de transferencia`,
          type: 'success'
        });
        setTimeout(() => {
          document.body.removeChild(text);
          document.body.removeChild(button);
        }, 100);
      }
    });
    button.click();
  }

  private saveAsPdf(cssSelector: string, fileName: string) {
    return this.printScreen(cssSelector).pipe(
      switchMap(data=> {
        var subject = new Subject();
        const doc = new jsPDF('p', 'cm');
        const imgSize = this.convertPixToCm(data.height, data.width);
        var imgData = data.canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG',0,0, imgSize.w, imgSize.h);
        doc.save(fileName+'.pdf');
        return subject;
      }),
      delay(3000));
  }

  convertPixToCm(height: number, width: number): { h: number; w: number; } {
    console.log(`px: h = ${height}, w = ${width}`);
    const imageWidthInCm = 16;
    const ratio = height / width;
    const dimensions = {
      h: Math.round(ratio * imageWidthInCm),
      w: imageWidthInCm
    };

    console.log(`convertPixToCm: h = ${dimensions.h}cm, w = ${dimensions.w}cm`);
    return dimensions;
  }

  private printScreen(selector: string) {

    return of(selector).pipe(
      // tap(()=> {
      //   document.body.style.backgroundColor = 'red';
      // }),
      // delay(500),
      switchMap(selector=> {
        const html = document.querySelector(selector) as HTMLElement;
        const width = html.offsetWidth;
        const height = html.offsetHeight;
        return from(html2canvas(html)).pipe(map(canvas=> ({
          canvas,
          width,
          height
        })));
      }));
  }

  private saveAsJpg(selector: string, fileName: string): Observable<any> {

    return this.printScreen(selector).pipe(
      tap(data=> {
        let a = document.createElement('a');
        a.href = data.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.download = `${fileName}.jpg`;
        a.click();
      }),
      delay(2000));
  }

  save(type: ShareServiceOptions, selector: string, fileName: string){
    return {
      pdf: ()=> this.saveAsPdf(selector, fileName),
      img: ()=> this.saveAsJpg(selector, fileName)
    }[type]();
  }
}
