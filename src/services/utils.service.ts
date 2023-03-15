// constructor() {}
import SelectFromListModal from '$components/SelectItemFromListModal.svelte'
import { modalController } from '$ionic/svelte'

import { showConfirm } from '$services/alert.service';
import { goto } from '$app/navigation';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const gen_random_uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
    export const uuid_generate_v4 = gen_random_uuid;
  
    export const formatDate = (date: string) => {
      if (!date) return '';
      try {
        const d = new Date(date)
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()  
      } catch (error) {
        return '';
      }
    }
    
    export const selectItemFromList = async (obj: any) => {
      const openModal = await modalController.create({
        component: SelectFromListModal,
        componentProps: {
          // dark: false //this.dark
          title: obj.title || "Select Item",
          items: obj.items || [],
          currentItem: obj.currentItem || "",
          allow_write_in: obj.allow_write_in || false,
        },
        showBackdrop: true,
        backdropDismiss: true,
      });
      await openModal.present()
      const { data } = await openModal.onWillDismiss();
      return data;
    }
  