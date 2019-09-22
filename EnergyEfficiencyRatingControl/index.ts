import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class EnergyEfficiencyRatingControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;

	private _slider: HTMLInputElement;
	private _ratingLetterDiv: HTMLDivElement;

	private _sliderOnChange: EventListenerOrEventListenerObject;
	private _sliderOnInput: EventListenerOrEventListenerObject;

	private _value: number;
	
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._container = container;
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._value = 0;
		
		if(context.parameters.rating == null){
			this._value = 0;
		}else{
			this._value = context.parameters.rating.raw == null ? 0 : context.parameters.rating.raw;
		}
		debugger;

		this._sliderOnChange = this.sliderOnChange.bind(this);
		this._sliderOnInput = this.sliderOnInput.bind(this);
		this.renderEnergyValue.bind(this);

		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.value = String(this._value);
		slider.classList.add("slider");
		slider.addEventListener("change", this._sliderOnChange);
		slider.addEventListener("input", this._sliderOnInput);

		let energyClass = document.createElement("div");
		energyClass.classList.add("energy-class");

		let ratingLetterDiv = document.createElement("div");
		energyClass.appendChild(ratingLetterDiv);
		container.appendChild(energyClass)

		//ratingLetterDiv.classList.add("letter");

		this._ratingLetterDiv = ratingLetterDiv;
		this._slider = slider;

		container.appendChild(slider);
		container.appendChild(energyClass);

		this.renderEnergyValue(this._value);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			rating: this._value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	public sliderOnChange():void{
		this._value = +this._slider.value;
		this._notifyOutputChanged();
	}

	public sliderOnInput():void{
		let sliderValue = +this._slider.value;
		this.renderEnergyValue(sliderValue);
	}

	public renderEnergyValue(energyValue:number):void{
		if(energyValue >= 0 && energyValue <= 20){
			this._ratingLetterDiv.className = "g-rating";
		}else if(energyValue > 20 && energyValue <= 38){
			this._ratingLetterDiv.className = "f-rating";
		}else if(energyValue > 38 && energyValue <= 54){
			this._ratingLetterDiv.className = "e-rating";
		}else if(energyValue > 54 && energyValue <= 68){
			this._ratingLetterDiv.className = "d-rating";
		}else if(energyValue > 68 && energyValue <= 80){
			this._ratingLetterDiv.className = "c-rating";
		}else if(energyValue > 80 && energyValue <= 91){
			this._ratingLetterDiv.className = "b-rating";
		}else if(energyValue > 91 && energyValue <= 100){
			this._ratingLetterDiv.className = "a-rating";		
		}
		this._ratingLetterDiv.style.width = energyValue+"%";
		this._ratingLetterDiv.innerHTML  = " "+energyValue;	
	}
}