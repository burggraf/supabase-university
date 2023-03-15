import { toastController } from "$ionic/svelte";

export const toast = async (message: string, color: string = 'danger', duration: number = 3000, toastPosition: string = 'top') => {
  const toast = await toastController.create({
      message: message,
      color: color,
      cssClass: 'toast', // see: /src/theme/variables.css
      position: toastPosition,
      buttons: [{ icon: 'close', handler: () => {} }],
      duration: duration
    });
    await toast.present();
  }
