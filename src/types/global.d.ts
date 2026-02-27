declare global {
    namespace NodeJS {
      interface Global {
        uiComponentStore: any;
        name: string;
        kspanelVersion: string;
        adminMenuItems: any[];
        regularMenuItems: any[];
      }
    }
  }
  
export {};