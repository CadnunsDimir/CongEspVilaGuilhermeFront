import { Injectable } from '@angular/core';
import { Notification, NotificationsService } from '../notifications/notifications.service';

interface ShareLinkData {
  title: string, url: string
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  enableNativeShare =  location.host.includes("https");

  constructor(private notify: NotificationsService) { }

  async shareLink(shareLinkdata: ShareLinkData){
    if (this.enableNativeShare && navigator.canShare(shareLinkdata)) {
      var notification: Notification;
      try{
        await navigator.share(shareLinkdata);
        notification = {
          message: "Compartilhando...",
          type: 'info'
        };
      } catch(error: any) {
        notification = {
          message: error.message,
          type: 'error'
        };
        setTimeout(() => this.sendToClipboard(shareLinkdata), 5000);
      }
      this.notify.send(notification);
    }else{
      this.sendToClipboard(shareLinkdata);
    }
  }
  
  private sendToClipboard({title, url}: ShareLinkData) {
    var button = document.createElement('button');
    var text = document.createElement('input');
    document.body.appendChild(text);
    document.body.appendChild(button);
    text.value = url; 

    button.addEventListener('click', ()=> {
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
        setTimeout(()=>{
          document.body.removeChild(text);
          document.body.removeChild(button);
        }, 100);
      }
    });
    button.click();
  }
}
