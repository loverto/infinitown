import {DefaultLoadingManager, FileLoader} from "three";

class BaseFileLoader extends FileLoader{
    constructor(data) {
        super(data);
        this.setResponseType('arraybuffer');
        this.manager = undefined !== data ? data : DefaultLoadingManager;
    }
}

export default BaseFileLoader
