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
        this.earth = this.resources.items.earth;
        this.wood = this.resources.items.wood;
        console.log(this.actualRoom.children);

        this.setModel();
        this.createInterface();
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
            };

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
        this.actualRoom.rotation.y = Math.PI;

        this.actualRoom.children.forEach((child) => {
             if(child.name === "Door") {
                console.log("found");
                this.door = child;
            } else if(child.name === "DoorDecor") {
                this.doorDecor = child
            };
        })
           

        this.actualRoom.children.forEach((child) => {
            if(child.name === "DoorWay") {
                child.scale.set(0,0,0)
           };
       })
       
        console.log(this.door);
        console.log(this.doorDecor);


        const geometryBox = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
        const materialBox = new THREE.MeshBasicMaterial( { map: this.wood } );
        const mesh = new THREE.Mesh( geometryBox, materialBox );
        mesh.position.set(-1, 0.2, 1.5);
        if(mesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
        this.scene.add( mesh );

        const geometry = new THREE.SphereGeometry( 0.2, 32, 16 ); 
        const material = new THREE.MeshBasicMaterial( { map: this.earth.texture } ); 
        const sphere = new THREE.Mesh( geometry, material ); 

        sphere.position.set(0, 0.4, 2);
        if(sphere) {
            sphere.castShadow = true;
            sphere.receiveShadow = true;
        }


        this.scene.add( sphere );
    }

    createInterface() {
        // Создание элементов интерфейса для изменения ширины и высоты двери
        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.min = '1';
        widthInput.max = '4';
        widthInput.step = '0.05'; 
        widthInput.value = this.door.scale.x;

        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.min = '1';
        heightInput.max = '4';
        heightInput.step = '0.02'; 
        heightInput.value = this.door.scale.y;

        widthInput.addEventListener('input', () => {
            this.door.scale.x = parseFloat(widthInput.value);
        });

        heightInput.addEventListener('input', () => {
            this.door.scale.y = parseFloat(heightInput.value);
        });

        const widthLabel = document.createElement('label');
        widthLabel.innerText = 'Width: ';
        widthLabel.appendChild(widthInput);

        const heightLabel = document.createElement('label');
        heightLabel.innerText = 'Height: ';
        heightLabel.appendChild(heightInput);

        const interfaceContainer = document.createElement('div');
        interfaceContainer.style.position = 'absolute';
        interfaceContainer.style.top = '10px';
        interfaceContainer.style.left = '10px';
        interfaceContainer.style.zIndex = '9999';
        interfaceContainer.appendChild(widthLabel);
        interfaceContainer.appendChild(heightLabel);

        document.body.appendChild(interfaceContainer);

        
    }



    resize() { }

    update() { }
}