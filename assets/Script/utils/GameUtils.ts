
export class GameUtils {

    private static _instance:GameUtils = null;
    public windowTool:any = window;
    public pinus:Pomelo = null;

    //// 设计分辨率
    public static size_width:number = 1920;
    public static size_height:number = 1080;

    ///// 屏幕中心点
    public static centre_x:number = 960;
    public static centre_y:number = 540;

    ///// http地址
    // public static http_url:string = "http://127.0.0.1:3002";
    public static http_url:string = "http://17731in702.iask.in";
    

    //// 用户 登录 数据
    public static uid:number = null;
    public static token:string = null;

    public static mary_slot_room_index:number = null; //// 1-4

    public static getInstance():GameUtils {
        if (!GameUtils._instance) {
            GameUtils._instance = new GameUtils();
        }
        return GameUtils._instance;
    }

    init() {
        this.pinus = this.windowTool.pomelo;
    }
}
