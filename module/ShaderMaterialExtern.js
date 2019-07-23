import * as THREE  from 'three';
var keys = ['side', 'alphaTest', 'transparent', 'depthWrite', 'shading', 'wireframe'];

var ShaderMaterialExtern = function(obj) {
    obj = obj || {};
    THREE.ShaderMaterial.call(this, obj);
    _.each(keys, function(property) {
        var method = obj[property];
        if (undefined !== method) {
            this[property] = method;
        }
    }, this);
};
ShaderMaterialExtern.inherit(THREE.ShaderMaterial, {
    onPropertyChange : function(e, prop) {
        Object.defineProperty(this, e, {
            get : function() {
                return this['_' + e];
            },
            set : function(result) {
                this['_' + e] = result;
                prop.call(this, result);
            }
        });
    },
    clone : function(to) {
        var material = to || new ShaderMaterialExtern;
        THREE.Material.prototype.clone.call(this, material)
        material.shading = this.shading
        material.wireframe = this.wireframe
        material.wireframeLinewidth = this.wireframeLinewidth
        material.fog = this.fog
        material.lights = this.lights
        material.vertexColors = this.vertexColors
        material.skinning = this.skinning
        material.morphTargets = this.morphTargets
        material.morphNormals = this.morphNormals
        return material;
    }
});

export default ShaderMaterialExtern;
