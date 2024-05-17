import { Injectable } from '@angular/core';
import { Notification, NotificationsService } from '../notifications/notifications.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Observable, Subject, delay, from, of, switchMap, tap } from 'rxjs';

interface ShareLinkData {
  title: string, url: string
}

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

  saveAsPdf(cssSelector: string, fileName: string) {
    
    const width = 1800;

    const pdfOptions = {
      x: 1,
      y: 1,
      width: width * 0.225,
      windowWidth: width
    };

    // var html = document.querySelector(cssSelector) as HTMLElement;
    // const doc = new jsPDF();
    // doc.html(html, {
    //   callback: (doc) => {
    //     doc.save(fileName);        
    //     subject.next(this.OperationsOk);
    //   },
    //   ...pdfOptions
    // });

    // return subject.asObservable().pipe(delay(3000));
    return this.printScreen(cssSelector).pipe(
      switchMap(canvas=> {
        var subject = new Subject();
        const doc = new jsPDF();
        doc.html(canvas, {
          callback: (doc) => {
            doc.save(fileName);        
            subject.next(this.OperationsOk);
          },
          ...pdfOptions
        });
        return subject;
      }),
      delay(3000));
  }

  private printScreen(selector: string) {   
    return from(html2canvas(document.querySelector(selector)!!));
  }

  saveAsJpg(selector: string, fileName: string): Observable<any> {
    // var subject = new Subject();
    // html2canvas(document.querySelector(selector)!!).then(canvas=> {
    //   var a = document.createElement('a');
    //   a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //   a.download = `${fileName}.jpg`;
    //   a.click();
    //   of().pipe(delay(2000)).subscribe(()=> subject.next(this.OperationsOk));      
    // });
    // return subject.asObservable().pipe(delay(500));

    return this.printScreen(selector).pipe(
      tap(canvas=> {
        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.download = `${fileName}.jpg`;
        a.click();
      }),
      delay(2000));
  }
}
