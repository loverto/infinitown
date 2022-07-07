import * as basicfs from 'module/glsl/basicfs.glsl'
import * as basicvs from 'module/glsl/basicvs.glsl'
import * as pbrfs from 'module/glsl/pbrfs.glsl'
import * as pbrvs from 'module/glsl/pbrvs.glsl'

export default {
    "basic.fs" : basicfs.default,
    "basic.vs" : basicvs.default,
    "pbr.fs" : pbrfs.default,
    "pbr.vs" : pbrvs.default
};
