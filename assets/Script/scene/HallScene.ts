import { GameUtils } from "../utils/GameUtils";
import { Http } from "../net/Http";
import Alert from "../base/Alert";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallScene extends cc.Component {

    @property(cc.Node)
    avatar: cc.Node = null;

    @property(cc.Label)
    lbl_uid:cc.Label = null;
    @property(cc.Label)
    lbl_name:cc.Label = null;
    @property(cc.Label)
    lbl_sex:cc.Label = null;
    @property(cc.Label)
    lbl_coin:cc.Label = null;

    @property(cc.Button)
    btn_mary_slot:cc.Button = null;

    ///////////////// 弹窗组件
    @property(cc.Prefab)
    alertPrefab: cc.Prefab = null;

    private alertDialog: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.alertDialog = cc.instantiate(this.alertPrefab);
        this.alertDialog.x = GameUtils.centre_x;
        this.alertDialog.y = GameUtils.centre_y;
        this.get_info();

        
        this.btn_mary_slot.node.on("click",this.enter_mary_slot.bind(this),this);
    }

    // update (dt) {}

    get_info() {
        let alert:Alert = this.alertDialog.getComponent(Alert);
        let url:string = GameUtils.http_url+'/get_info';
        Http.post(url,{uid:GameUtils.uid,token:GameUtils.token},(eventName: string, xhr: XMLHttpRequest)=>{
            if (eventName == 'COMPLETE') {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = JSON.parse(xhr.responseText)
                    console.log(response);
                    if (response.code == 0) {
                        ///// 显示用户信息
                        let {uid,name,sex,avatar,coin} = response.data;
                        this.lbl_uid.string = uid;
                        this.lbl_name.string = name;
                        this.lbl_sex.string = sex;
                        this.lbl_coin.string = coin;
                    }else{
                        alert.showAlert(response.data, function(){
                        }, false);
                    }
                }
            } else if (eventName == 'TIMEOUT') {
                //TODO:添加提示连接网关超时
                console.log("超时");
            } else if (eventName == 'ERROR') {
                console.log("错误");
            }
        },this);
    }

    /**
     * 进入水果玛丽
     */
    enter_mary_slot() {
        GameUtils.mary_slot_room_index = 1; /// 房间编号
        cc.director.loadScene("MarySlotScene");
    }
}
