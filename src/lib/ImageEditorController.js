/**
 * Image editor controller.
 *
 * @author Marek Mego
 */

import { EventTarget } from "./EventTarget.js";
			
class ImageEditorController extends EventTarget{
	constructor(canvas) {
		super();
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");
		this._originalImage = new Image(); // backup for undo
		this._image = new Image(); // image to edit
		this._helpers = []; // multiple helpers can be active at once
		this._tools = []; // only one tool can be active at the moment
		this._activeTool = null;	
		this._image.onload = (e) => this.onImageLoad(e);
	}
	
	static create(canvas) {
		return new ImageEditorController(canvas);
	}
		
	get canvas() { return this._canvas;}
	get ctx() { return this._ctx;}
	
	setImageSource(src) {
		this._image.src = src;
	}
	
	addTool(tool) {
		this._tools.push(tool);
	}
			
	activateTool(tool) {
		console.log("activating tool " + tool);
		// notify about tool override		
		if (this._activeTool != null) {
			this.dispatchEvent({type:"overridetool"});
		}
				
		// disable currently active tool if any		
		if (this._activeTool != null) this.deactivateTool(this._activeTool);
				
		// activate selected tool
		this._activeTool = tool;
		this._activeTool.activate();		
	}
	
	deactivateTool(tool) {
		console.log("deactivating tool" + tool);		
		if (this._activeTool == null) {
			console.warn("No tool to deactivate!");
		} else {
			this._activeTool.deactivate();
			this._activeTool = null;						
		}
	}
	
	addHelper(helper) {
		this._helpers.push(helper);
	}
	
	activateHelper(helper) {
		helper.activate();
	}
	
	deactivateHelper(helper) {
		helper.deactivate();
	}
	
	/**
	 * Event handlers.
	 */	 	
	onImageLoad(e) {		
		this._canvas.height = this._image.height;
		this._canvas.width = this._image.width;
		this.dispatchEvent({type:"imageload"});		
		// restart tool
		if (this._activeTool) {
			this._activeTool.deactivate();
			this._activeTool.activate();			
		}		
		this.onChange({type:"change"});
	}
	
	onChange(e) {
		console.log("ime onchange");
		this.draw();
	}
		
	/**
	 * Draws objects on canvas.
	 */
	draw() {	  				  			
		// clear canvas
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// draw image
		this._ctx.drawImage(this._image,0,0);
		
		// draw helpers
		for (var i = 0, l = this._helpers.length; i < l; i++) {
			this._helpers[i].draw();
		}
		
		// draw active tool
		if (this._activeTool != null) this._activeTool.draw();
	}

	
	
}

export { ImageEditorController };
