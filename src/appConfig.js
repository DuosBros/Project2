// export const LOCO_API = 'https://loco.bwin.prod/Api/';
export const LOCO_API = 'http://localhost:24298/Api/';
// export const LOCO_API = 'http://loco.dev.env.works/Api/';

export const KIBANA_SERVER_URL_PLACEHOLDER = "#KIBANA_SERVER_URL_PLACEHOLDER"
export const KIBANA_WINLOGBEAT_SERVER_URL = "https://kibana.prod.env.works/app/kibana#/dashboard/cbfd81a0-77fd-11e8-be52-174e84611352?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-2h,mode:relative,to:now))&_a=(description:'Winlogbeat%20LeanOps%20Dashboard%20dark',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'3d424b00-6284-11e8-b346-c9ba44719072',key:beat.hostname,negate:!f,params:(query:#KIBANA_SERVER_URL_PLACEHOLDER,type:phrase),type:phrase,value:#KIBANA_SERVER_URL_PLACEHOLDER),query:(match:(beat.hostname:(query:#KIBANA_SERVER_URL_PLACEHOLDER,type:phrase))))),fullScreenMode:!f,options:(darkTheme:!t,hidePanelTitles:!f,useMargins:!f),panels:!((embeddableConfig:(vis:(colors:(Error:%23BF1B00,Information:%23447EBC,Warning:%23E5AC0E),legendOpen:!f)),gridData:(h:25,i:'1',w:24,x:0,y:0),id:f61d63f0-39e7-11e8-8b97-492b9f87f461,panelIndex:'1',type:visualization,version:'6.3.1'),(columns:!(level,beat.hostname,source_name,message),gridData:(h:75,i:'2',w:36,x:0,y:50),id:'96eea150-39e7-11e8-8b97-492b9f87f461',panelIndex:'2',type:search,version:'6.3.1'),(gridData:(h:25,i:'5',w:12,x:0,y:25),id:'0b4e6f30-3b8c-11e8-8b97-492b9f87f461',panelIndex:'5',type:visualization,version:'6.3.1'),(embeddableConfig:(vis:(params:(sort:(columnIndex:1,direction:desc)))),gridData:(h:25,i:'6',w:12,x:12,y:25),id:'626b75b0-3b8c-11e8-8b97-492b9f87f461',panelIndex:'6',type:visualization,version:'6.3.1'),(gridData:(h:20,i:'7',w:24,x:24,y:0),id:bb63f2f0-3b8c-11e8-8b97-492b9f87f461,panelIndex:'7',type:visualization,version:'6.3.1'),(embeddableConfig:(vis:(legendOpen:!f)),gridData:(h:10,i:'9',w:12,x:24,y:35),id:Sources,panelIndex:'9',type:visualization,version:'6.3.1'),(gridData:(h:15,i:'12',w:12,x:36,y:35),id:ec691bb0-77fe-11e8-be52-174e84611352,panelIndex:'12',type:visualization,version:'6.3.1'),(gridData:(h:15,i:'13',w:8,x:36,y:50),id:'067ecfe0-77ff-11e8-be52-174e84611352',panelIndex:'13',type:visualization,version:'6.3.1'),(gridData:(h:15,i:'14',w:12,x:24,y:20),id:cf73a020-77fe-11e8-be52-174e84611352,panelIndex:'14',type:visualization,version:'6.3.1'),(gridData:(h:15,i:'15',w:12,x:36,y:20),id:'60df8fb0-77ff-11e8-be52-174e84611352',panelIndex:'15',type:visualization,version:'6.3.1')),query:(language:lucene,query:''),timeRestore:!t,title:'%5BWinlogbeat%5D%20Dashboard%202',viewMode:view)"

export const KIBANA_PERFCOUNTER_SERVER_URL = "https://kibana.prod.env.works/app/kibana#/dashboard/25494e40-41b4-11e8-9ab2-ab837363b7d6?_g=(filters:!())&_a=(description:'Windows%20Perfcounter%20per%20Host',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:bfe4e930-6286-11e8-b346-c9ba44719072,key:beat.hostname,negate:!f,params:(query:#KIBANA_SERVER_URL_PLACEHOLDER,type:phrase),type:phrase,value:#KIBANA_SERVER_URL_PLACEHOLDER),query:(match:(beat.hostname:(query:#KIBANA_SERVER_URL_PLACEHOLDER,type:phrase))))),fullScreenMode:!f,options:(darkTheme:!f,useMargins:!f),panels:!((gridData:(h:15,i:'31',w:24,x:0,y:15),id:'4b8e4ba0-3c5a-11e8-8b97-492b9f87f461',panelIndex:'31',type:visualization,version:'6.3.1'),(gridData:(h:10,i:'34',w:8,x:40,y:5),id:ed731b70-41b5-11e8-8b97-492b9f87f461,panelIndex:'34',type:visualization,version:'6.3.1'),(gridData:(h:15,i:'36',w:24,x:24,y:15),id:'53731ee0-42fe-11e8-9ab2-ab837363b7d6',panelIndex:'36',type:visualization,version:'6.3.1'),(gridData:(h:15,i:'37',w:16,x:32,y:30),id:a136f520-42fe-11e8-9ab2-ab837363b7d6,panelIndex:'37',type:visualization,version:'6.3.1'),(gridData:(h:15,i:'38',w:16,x:16,y:30),id:'8fd7a180-42fe-11e8-9ab2-ab837363b7d6',panelIndex:'38',type:visualization,version:'6.3.1'),(gridData:(h:15,i:'39',w:16,x:0,y:30),id:'781664a0-42fe-11e8-9ab2-ab837363b7d6',panelIndex:'39',type:visualization,version:'6.3.1'),(gridData:(h:5,i:'40',w:48,x:0,y:0),id:'62fbe850-42ff-11e8-9ab2-ab837363b7d6',panelIndex:'40',type:visualization,version:'6.3.1'),(gridData:(h:10,i:'41',w:8,x:24,y:5),id:bb796ff0-4351-11e8-9ab2-ab837363b7d6,panelIndex:'41',type:visualization,version:'6.3.1'),(gridData:(h:10,i:'42',w:8,x:32,y:5),id:f2468540-4351-11e8-9ab2-ab837363b7d6,panelIndex:'42',type:visualization,version:'6.3.1'),(gridData:(h:10,i:'43',w:8,x:16,y:5),id:a70a9cf0-4352-11e8-9ab2-ab837363b7d6,panelIndex:'43',type:visualization,version:'6.3.1'),(gridData:(h:10,i:'44',w:8,x:0,y:5),id:b0734870-4350-11e8-8b97-492b9f87f461,panelIndex:'44',type:visualization,version:'6.3.1'),(gridData:(h:10,i:'45',w:8,x:8,y:5),id:d7965b40-4350-11e8-8b97-492b9f87f461,panelIndex:'45',type:visualization,version:'6.3.1')),query:(language:lucene,query:''),timeRestore:!f,title:'%5BMetricbeat%20System%5D%20Windows%20Host%20overview',viewMode:view)"

export const INCIDENT_PLACEHOLDER = "#INCIDENT_PLACEHOLDER"
export const SN_INC_SEARCH_URL = "https://gvcgroup.service-now.com/textsearch.do?sysparm_tsgroups=&sysparm_view=text_search&sysparm_search=#INCIDENT_PLACEHOLDER"

export const VERSION1_PLACEHOLDER = "#VERSION1_PLACEHOLDER"
export const VERSION1_SEARCH_URL = "https://www52.v1host.com/GVCGroup/Search.mvc/Advanced?q=#VERSION1_PLACEHOLDER"

export const DISME_SERVICE_PLACEHOLDER = "#DISME_SERVICE_PLACEHOLDER"
export const DISME_SERVICE_URL = "https://disme.bwin.corp/out/out.ServiceMgr.php?serviceid=#DISME_SERVICE_PLACEHOLDER"

export const warningColor = '#f7ead89c'
export const successColor = '#f5fbe7'
export const errorColor = '#f2005614'

// $files = gci "C:\Users\atran1\Desktop\work\bwin\src\loco\frontend\bwin.loco.client\src\" -Recurse -File | ?{$_.Fullname -notlike "*assets*"}
// $b = 0;foreach($file in $files){$a = Get-content $file.Fullname;$b = $b + $a.length;};$b

// 15.11. 3422