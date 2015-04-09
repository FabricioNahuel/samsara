/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var Transform = require('../core/Transform');
    var Modifier = require('../core/Modifier');
    var View = require('./View');

    /**
     * Allows you to link two renderables as front and back sides that can be
     *  'flipped' back and forth along a chosen axis. Rendering optimizations are
     *  automatically handled.
     *
     * @class Flipper
     */

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    module.exports = View.extend({
        defaults : {
            transition : true,
            direction : CONSTANTS.DIRECTION.X
        },
        initialize : function(){
            this.angle = new Transitionable(0);

            var frontModifier = new Modifier({
                size : function(){
                    return this.frontNode.getSize();
                }.bind(this),
                transform : function() {
                    var angle = this.angle.get();
                    return (this.options.direction === CONSTANTS.DIRECTION.X)
                        ? Transform.rotateY(angle)
                        : Transform.rotateX(angle)
                }.bind(this),
                origin : [0.5, 0.5]
            });

            var backModifier = new Modifier({
                size : function(){
                    return this.backNode.getSize();
                }.bind(this),
                transform : function() {
                    var angle = this.angle.get() + Math.PI;
                    return (this.options.direction === CONSTANTS.DIRECTION.X)
                        ? Transform.rotateY(angle)
                        : Transform.rotateX(angle)
                }.bind(this),
                origin : [0.5, 0.5]
            });

            this.frontNode = this.add(frontModifier);
            this.backNode = this.add(backModifier);
        },
        setFront : function setFront(front){
            this.frontNode.add(front);
        },
        setBack : function setFront(back){
            this.backNode.add(back);
        },
        setAngle : function setAngle(angle, transition, callback){
            if (transition === undefined) transition = this.options.transition;
            if (this.angle.isActive()) this.angle.halt();
            this.angle.set(angle, transition, callback);
        }
    }, CONSTANTS);
});
