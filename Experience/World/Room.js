import * as THREE from "three";
import Experience from "../Experience.js";
import { Reflector } from "../Utils/Reflector.js";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        console.log(this.room);
        console.log(this.actualRoom);

        this.setModel();
    }

    setModel() {
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Group) {
                child.children.forEach((groupchild) => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                })
            }
        })

        const mirrorOptions = {
            clipBias: 0.000,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0x808080,
            multisample: 4,
        }

        const mirrorGeometry = new THREE.PlaneGeometry(2, 5);

        const mirror = new Reflector(mirrorGeometry, mirrorOptions);

        mirror.rotateZ(Math.PI/2);
        mirror.rotateX(Math.PI/5);
        mirror.position.set(-1.1, 0.35, 0.47)
        mirror.scale.set(0.3, 0.07,)
        
        this.scene.add(mirror);
        this.scene.add(this.actualRoom)
        this.actualRoom.scale.set(0.4, 0.4, 0.4);
        this.actualRoom.rotation.y = Math.PI
    }


    resize() { }

    update() { }
}