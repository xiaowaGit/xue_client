import Slot from "../base/Slot";
import { Image_Slot } from "../utils/tool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    node_line: cc.Node = null;

    @property(cc.Node)
    node_slot: cc.Node = null;

    @property(cc.Button)
    btn_start: cc.Button = null;

    @property(cc.Button)
    btn_max_bet:cc.Button = null;

    ///////////////// slot组件
    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    /// slot
    private slot_list:Slot[] = [];

    private slot_y:number = 45;
    private slot_move_x:number = -485/2;
    // onLoad () {}

    start () {
        let o_x:number = this.slot_move_x * 2;
        let o_y:number = this.slot_y;
        for (let i = 0; i < 5; i++) {
            let one_slot:cc.Node = cc.instantiate(this.slotPrefab);
            one_slot.x = o_x;
            one_slot.y = o_y;
            o_x -= this.slot_move_x;
            this.node_slot.addChild(one_slot);
            let slot:Slot = one_slot.getComponent(Slot);
            slot.init(false);
            this.slot_list.push(slot);
        }
        
        this.btn_start.node.on("click",this.start_up.bind(this),this);
    }

    /**
     * 开始slot
     */
    start_up() {
        let element_list:Image_Slot[] = [Image_Slot.Image_Banana,Image_Slot.Image_Mango,Image_Slot.Image_Pineapple];
        this.slot_list[0].start_up(element_list,50,5);
        this.slot_list[1].start_up(element_list,50,5.4);
        this.slot_list[2].start_up(element_list,50,5.8);
        this.slot_list[3].start_up(element_list,50,6.2);
        this.slot_list[4].start_up(element_list,50,6.6);
    }

    // update (dt) {}
}
