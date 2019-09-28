import { Image_Slot } from "../utils/tool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Slot extends cc.Component {

    @property(cc.Node)
    node_list: cc.Node = null;

    @property([cc.SpriteFrame])
    spr_frame_list:cc.SpriteFrame[] = [];

    private static SLOT_Y:number = 590/2;
    private static SMALL_SLOT_Y:number = 200/2;

    private static SLOT_HEIGHT:number = 590;
    private static SMALL_SLOT_HEIGHT:number = 200;

    private is_small:boolean = false;
    private _move_y:number = 0; // 初始化的 node_list 子元素 y = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    init(is_small:boolean) {
        this.is_small = is_small;
        if (this.is_small) {
            this.node.height = Slot.SMALL_SLOT_HEIGHT;
            this.node_list.y = Slot.SMALL_SLOT_Y;
            this.push_element();
        }else{
            this.node.height = Slot.SLOT_HEIGHT;
            this.node_list.y = Slot.SLOT_Y;
            this.push_element();
            this.push_element();
            this.push_element();
        }
    }

    /**
     * 压入元素到node_list
     * @param element 
     */
    push_element(element:cc.SpriteFrame = null) {
        if (element) {
            let node = new cc.Node();
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = element;

            node.scale = 1.33;
            this.node_list.addChild(node);
            node.y = this._move_y - 100;
            this._move_y -= 200;
        }else{
            let rnd:number = Math.floor(Math.random() * this.spr_frame_list.length);
            let node = new cc.Node();
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.spr_frame_list[rnd];
            
            node.scale = 1.33;
            this.node_list.addChild(node);
            node.y = this._move_y - 100;
            this._move_y -= 200;
        }
    }

    /**
     * 移除列表 所有元素
     */
    clean_all_element() {
        if (this.is_small) this.node_list.y = Slot.SMALL_SLOT_Y;
        else this.node_list.y = Slot.SLOT_Y;
        this.node_list.removeAllChildren(true);
        this._move_y = 0;
    }

    init_element(element_list:Image_Slot[],element_num:number) {
        if (element_num < 20 || element_num > 200)throw new Error("init_element() element_num number error ");
        if (element_list.length != 3 && element_list.length != 1) throw new Error("init_element() element_list length error ");
        
        this.clean_all_element();
        for (let i = 0; i < element_num; i++) {
            this.push_element();
        }
        for (let i = 0; i < element_list.length; i++) {
            const e = element_list[i];
            this.push_element(this.spr_frame_list[e-1]);
        }
    }

    start_up(element_list:Image_Slot[],element_num:number,second:number) {
        this.init_element(element_list,element_num);
        if (this.is_small) {
            let action:cc.ActionInterval = cc.moveBy(second,0,-1*this._move_y-Slot.SMALL_SLOT_HEIGHT).easing(cc.easeExponentialOut());
            this.node_list.runAction(action);
        }else{
            let action:cc.ActionInterval = cc.moveBy(second,0,-1*this._move_y-Slot.SLOT_HEIGHT).easing(cc.easeExponentialOut());
            this.node_list.runAction(action);
        }
    }

    // update (dt) {}
}
