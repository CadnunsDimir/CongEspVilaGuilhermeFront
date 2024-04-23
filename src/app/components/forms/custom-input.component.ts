import { AfterViewInit, Component, Injector, Input, OnChanges, OnInit, SimpleChanges,  forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";

@Component({
  selector: 'custom-input',
  template: `
  <input [type]="type"
         [id]="id"
         [placeholder]="placeholder"
         [autocomplete]="autocomplete"
         (input)="valueChanged($event)"
         (keyup)="keyup()"
         [ngClass]="{error: showError}" />
    <div class="error-msg" *ngIf="showError">
      {{errorMessage}}
    </div>`,
  styles: `
  .error-msg {
      font-size: .9rem;
      color: #e74c4c;
      text-align: right;
    }

  input.error{
    border-color: #e74c4c;
    border-width: 2.5px;
  }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomInputComponent),
    },
  ],
})
export class CustomInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  
  @Input()
  placeholder?: string;

  @Input()
  autocomplete?: string;

  @Input()
  id?: string;

  @Input()
  type: string = 'text'

  currentValue: any;
  onTouched = () => { };
  touched = false;
  disabled = false;
  formControl?: FormControl<any>;
  showError = false;
  errorMessage?: string;

  constructor(
    private injector: Injector
  ) {
  }


  ngAfterViewInit(): void {
    const ngControl = this.injector.get(NgControl, null);
    if (ngControl && ngControl.control) {
      this.formControl = ngControl.control as FormControl;
    } else {
      console.error("[custom-input] formControl not found");
    }
  }

  translateError(errors: any) {
    const map = {
      required: () => "campo necessário",
      minlength: (error: any) => `faltam ${error.requiredLength - error.actualLength} caracter(es)`
    } as any;

    for (var i in errors) {
      var searchedMessage = map[i];
      if (searchedMessage) {
        return searchedMessage(errors[i]);
      }
    }
    return null;
  }

  valueChanged($event: any) {    
    this.onChange($event.target.value);
  }

  keyup() {
    this.showError = !this.formControl?.pristine && !!this.formControl?.errors;
    this.errorMessage = this.translateError(this.formControl?.errors);
  }

  onChange = (value: any) => { console.log("[custom-input] default onChange") }

  ngOnInit(): void {
  }

  writeValue(obj: any): void {
    this.currentValue = obj;
  }
  registerOnChange(fn: any): void {    
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
