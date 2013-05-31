/// <reference path="../../core/Vec2.ts" />
/// <reference path="../../core/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="../../physics/AABB.ts" />
/// <reference path="../../physics/Circle.ts" />
/// <reference path="../../physics/IPhysicsShape.ts" />
/// <reference path="../../physics/IPhysicsBody.ts" />

/**
* Phaser - Components - Physics
*/

module Phaser.Components {

    export class Physics implements Phaser.Physics.IPhysicsBody {

        constructor(parent: Sprite) {

            this.game = parent.game;
            this._sprite = parent;

            this.gravity = Vec2Utils.clone(this.game.world.physics.gravity);
            this.drag = Vec2Utils.clone(this.game.world.physics.drag);
            this.bounce = Vec2Utils.clone(this.game.world.physics.bounce);
            this.friction = Vec2Utils.clone(this.game.world.physics.friction);

            this.velocity = new Vec2;
            this.acceleration = new Vec2;

            this.touching = Phaser.Types.NONE;
            this.wasTouching = Phaser.Types.NONE;
            this.allowCollisions = Phaser.Types.ANY;

            this.shape = this.game.world.physics.add(new Phaser.Physics.AABB(this.game, this._sprite, this._sprite.x, this._sprite.y, this._sprite.width, this._sprite.height));

        }

        private _sprite: Sprite;

        public game: Game;
        public shape: Phaser.Physics.IPhysicsShape;

        /**
         * Whether this object will be moved by impacts with other objects or not.
         * @type {boolean}
         */
        public immovable: bool = false;

        /**
         * Set this to false if you want to skip the automatic movement stuff
         * @type {boolean}
         */
        public moves: bool = true;

        public gravity: Vec2;
        public drag: Vec2;
        public bounce: Vec2;
        public friction: Vec2;
        public velocity: Vec2;
        public acceleration: Vec2;

        public touching: number;
        public allowCollisions: number;
        public wasTouching: number;
        public mass: number = 1;

        public setCircle(diameter: number) {

            //  Here is the stuff I want to remove
            this.game.world.physics.remove(this.shape);
            this.shape = this.game.world.physics.add(new Phaser.Physics.Circle(this.game, this._sprite, this._sprite.x, this._sprite.y, diameter));
            this._sprite.physics.shape.physics = this;

        }

        /**
         * Internal function for updating the position and speed of this object.
         */
        public update() {

            //  if this is all it does maybe move elsewhere? Sprite postUpdate?
            if (this.moves && this.shape)
            {
                this._sprite.x = (this.shape.position.x - this.shape.bounds.halfWidth) - this.shape.offset.x;
                this._sprite.y = (this.shape.position.y - this.shape.bounds.halfHeight) - this.shape.offset.y;
            }
        }

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this._sprite.texture.context.fillStyle = color;
            this._sprite.texture.context.fillText('Sprite: (' + this._sprite.frameBounds.width + ' x ' + this._sprite.frameBounds.height + ')', x, y);
            //this._sprite.texture.context.fillText('x: ' + this._sprite.frameBounds.x.toFixed(1) + ' y: ' + this._sprite.frameBounds.y.toFixed(1) + ' rotation: ' + this._sprite.rotation.toFixed(1), x, y + 14);
            this._sprite.texture.context.fillText('x: ' + this.shape.bounds.x.toFixed(1) + ' y: ' + this.shape.bounds.y.toFixed(1) + ' rotation: ' + this._sprite.rotation.toFixed(1), x, y + 14);
            this._sprite.texture.context.fillText('vx: ' + this.velocity.x.toFixed(1) + ' vy: ' + this.velocity.y.toFixed(1), x, y + 28);
            this._sprite.texture.context.fillText('ax: ' + this.acceleration.x.toFixed(1) + ' ay: ' + this.acceleration.y.toFixed(1), x, y + 42);

        }

    }

}