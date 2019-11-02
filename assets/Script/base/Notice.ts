import { GameUtils } from "../utils/GameUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Notice extends cc.Component {

    @property(cc.Sprite)
    spr_back:cc.Sprite = null;

    @property(cc.Label)
    lbl_info: cc.Label = null;

    
    private action_finish: cc.ActionInterval = null;
    private pinus: Pomelo;
    
    private _onNotice: any;

    onLoad () {
        this.node.active = false;
        this.lbl_info.node.x = 750;
        let self = this;
        let action_begin = cc.moveBy(8,-1500,0);
        let action_end = cc.callFunc(function () {
            self.node.active = false;
        },this);
        let action_finish = cc.sequence(action_begin,action_end);
        this.action_finish = action_finish;
        
        let pinus = GameUtils.getInstance().pinus;
        this.pinus = pinus;
        this._onNotice = this.onNotice.bind(this);
        this.pinus.on("onNotice",this._onNotice);
    }

    onNotice(data:{msg:string}) {
        this.node.active = true;
        this.lbl_info.node.x = 750;
        this.lbl_info.string = data.msg;
        this.lbl_info.node.runAction(this.action_finish);
    }

    //// 组件被销毁时触发该方法
    onDestroy() {
        // console.log("xiaowa ==========================  Notice onDestroy.");
        this.pinus.off("onNotice",this._onNotice);
    }
}
