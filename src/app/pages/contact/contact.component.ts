import {
  Component,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ViewChild,
  Inject,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements AfterViewInit {
  @ViewChild("formContainer") formContainer!: ElementRef;

  // Array of external CSS files to load
  private readonly styleLinks: string[] = [
    "https://cdn.jotfor.ms/stylebuilder/static/form-common.css?v=da2db26",
    "https://cdn.jotfor.ms/themes/CSS/5e6b428acc8c4e222d1beb91.css?v=3.3.63546",
    "https://cdn.jotfor.ms/css/styles/payment/payment_styles.css?3.3.63546",
    "https://cdn.jotfor.ms/css/styles/payment/payment_feature.css?3.3.63546",
  ];

  // Array of external JS files to load in order
  private readonly scriptLinks: any[] = [
    {
      src: "https://cdn.jotfor.ms/s/static/840be28a320/static/prototype.forms.js",
    },
    {
      src: "https://cdn.jotfor.ms/s/static/840be28a320/static/jotform.forms.js",
    },
    {
      src: "https://cdn.jotfor.ms/s/static/840be28a320/js/punycode-1.4.1.min.js",
      defer: true,
    },
    {
      src: "https://cdn.jotfor.ms/s/umd/624da1679f2/for-form-branding-footer.js",
      defer: true,
    },
    {
      src: "https://cdn.jotfor.ms/s/static/840be28a320/js/vendor/smoothscroll.min.js",
    },
    { src: "https://cdn.jotfor.ms/s/static/840be28a320/js/errorNavigation.js" },
  ];

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * After the view is initialized, we begin the process of loading all the
   * necessary assets for the Jotform to function correctly.
   */
  ngAfterViewInit() {
    this.loadAssets();
  }

  /**
   * Asynchronously loads all styles and scripts in the correct order.
   */
  private async loadAssets() {
    // Load all CSS files
    this.styleLinks.forEach((url) => this.loadStyle(url));

    // Execute the first inline script
    this.executeInlineScript("window.enableEventObserver=true;");

    // Load external scripts sequentially
    for (const scriptInfo of this.scriptLinks) {
      try {
        await this.loadScript(scriptInfo.src, scriptInfo.defer);
      } catch (error) {
        console.error(`Failed to load script: ${scriptInfo.src}`, error);
      }
    }

    // Once all external scripts are loaded, execute the remaining inline scripts
    this.executeAllInlineScripts();
  }

  /**
   * Creates a <link> element and appends it to the <head> of the document.
   * @param url The URL of the stylesheet.
   */
  private loadStyle(url: string): void {
    const link = this.renderer.createElement("link");
    this.renderer.setAttribute(link, "rel", "stylesheet");
    this.renderer.setAttribute(link, "type", "text/css");
    this.renderer.setAttribute(link, "href", url);
    this.renderer.appendChild(this.document.head, link);
  }

  /**
   * Creates a <script> element and appends it to the <head>. Returns a Promise
   * that resolves when the script has finished loading.
   * @param url The URL of the script.
   * @param defer Whether to add the 'defer' attribute.
   */
  private loadScript(url: string, defer: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      if (defer) {
        script.defer = true;
      }
      script.onload = () => resolve();
      script.onerror = (e: any) => reject(e);
      this.renderer.appendChild(this.document.head, script);
    });
  }

  /**
   * Creates a <script> element with the provided string content and appends
   * it to the form container.
   * @param content The JavaScript code to execute.
   */
  private executeInlineScript(content: string): void {
    const script = this.renderer.createElement("script");
    script.type = "text/javascript";
    script.text = content;
    this.renderer.appendChild(this.formContainer.nativeElement, script);
  }

  /**
   * Executes all the inline JavaScript blocks required by Jotform in sequence.
   */
  private executeAllInlineScripts(): void {
    // --- Main Jotform Configuration Script ---
    const jotformConfigScript = `
      JotForm.newDefaultTheme = true;
      JotForm.extendsNewTheme = false;
      JotForm.singleProduct = false;
      JotForm.newPaymentUIForNewCreatedForms = true;
      JotForm.texts = {"confirmEmail":"E-mail does not match","pleaseWait":"Please wait...","validateEmail":"You need to validate this e-mail","confirmClearForm":"Are you sure you want to clear the form","lessThan":"Your score should be less than or equal to","incompleteFields":"There are incomplete required fields. Please complete them.","required":"This field is required.","requireOne":"At least one field required.","requireEveryRow":"Every row is required.","requireEveryCell":"Every cell is required.","email":"Enter a valid e-mail address","alphabetic":"This field can only contain letters","numeric":"This field can only contain numeric values","alphanumeric":"This field can only contain letters and numbers.","cyrillic":"This field can only contain cyrillic characters","url":"This field can only contain a valid URL","currency":"This field can only contain currency values.","fillMask":"Field value must fill mask.","uploadExtensions":"You can only upload following files:","noUploadExtensions":"File has no extension file type (e.g. .txt, .png, .jpeg)","uploadFilesize":"File size cannot be bigger than:","uploadFilesizemin":"File size cannot be smaller than:","gradingScoreError":"Score total should only be less than or equal to","inputCarretErrorA":"Input should not be less than the minimum value:","inputCarretErrorB":"Input should not be greater than the maximum value:","maxDigitsError":"The maximum digits allowed is","minCharactersError":"The number of characters should not be less than the minimum value:","maxCharactersError":"The number of characters should not be more than the maximum value:","freeEmailError":"Free email accounts are not allowed","minSelectionsError":"The minimum required number of selections is ","maxSelectionsError":"The maximum number of selections allowed is ","pastDatesDisallowed":"Date must not be in the past.","dateLimited":"This date is unavailable.","dateInvalid":"This date is not valid. The date format is {format}","dateInvalidSeparate":"This date is not valid. Enter a valid {element}.","ageVerificationError":"You must be older than {minAge} years old to submit this form.","multipleFileUploads_typeError":"{file} has invalid extension. Only {extensions} are allowed.","multipleFileUploads_sizeError":"{file} is too large, maximum file size is {sizeLimit}.","multipleFileUploads_minSizeError":"{file} is too small, minimum file size is {minSizeLimit}.","multipleFileUploads_emptyError":"{file} is empty, please select files again without it.","multipleFileUploads_uploadFailed":"File upload failed, please remove it and upload the file again.","multipleFileUploads_onLeave":"The files are being uploaded, if you leave now the upload will be cancelled.","multipleFileUploads_fileLimitError":"Only {fileLimit} file uploads allowed.","dragAndDropFilesHere_infoMessage":"Drag and drop files here","chooseAFile_infoMessage":"Choose a file","maxFileSize_infoMessage":"Max. file size","generalError":"There are errors on the form. Please fix them before continuing.","generalPageError":"There are errors on this page. Please fix them before continuing.","wordLimitError":"Too many words. The limit is","wordMinLimitError":"Too few words.  The minimum is","characterLimitError":"Too many Characters.  The limit is","characterMinLimitError":"Too few characters. The minimum is","ccInvalidNumber":"Credit Card Number is invalid.","ccInvalidCVC":"CVC number is invalid.","ccInvalidExpireDate":"Expire date is invalid.","ccInvalidExpireMonth":"Expiration month is invalid.","ccInvalidExpireYear":"Expiration year is invalid.","ccMissingDetails":"Please fill up the credit card details.","ccMissingProduct":"Please select at least one product.","ccMissingDonation":"Please enter numeric values for donation amount.","disallowDecimals":"Please enter a whole number.","restrictedDomain":"This domain is not allowed","ccDonationMinLimitError":"Minimum amount is {minAmount} {currency}","requiredLegend":"All fields marked with * are required and must be filled.","geoPermissionTitle":"Permission Denied","geoPermissionDesc":"Check your browser's privacy settings.","geoNotAvailableTitle":"Position Unavailable","geoNotAvailableDesc":"Location provider not available. Please enter the address manually.","geoTimeoutTitle":"Timeout","geoTimeoutDesc":"Please check your internet connection and try again.","selectedTime":"Selected Time","formerSelectedTime":"Former Time","cancelAppointment":"Cancel Appointment","cancelSelection":"Cancel Selection","confirmSelection":"Confirm Selection","noSlotsAvailable":"No slots available","slotUnavailable":"{time} on {date} has been selected is unavailable. Please select another slot.","multipleError":"There are {count} errors on this page. Please correct them before moving on.","oneError":"There is {count} error on this page. Please correct it before moving on.","doneMessage":"Well done! All errors are fixed.","invalidTime":"Enter a valid time","doneButton":"Done","reviewSubmitText":"Review and Submit","nextButtonText":"Next","prevButtonText":"Previous","seeErrorsButton":"See Errors","notEnoughStock":"Not enough stock for the current selection","notEnoughStock_remainedItems":"Not enough stock for the current selection ({count} items left)","soldOut":"Sold Out","justSoldOut":"Just Sold Out","selectionSoldOut":"Selection Sold Out","subProductItemsLeft":"({count} items left)","startButtonText":"START","submitButtonText":"Submit","submissionLimit":"Sorry! Only one entry is allowed. <br> Multiple submissions are disabled for this form.","reviewBackText":"Back to Form","seeAllText":"See All","progressMiddleText":"of","fieldError":"field has an error.","error":"Error"};
      JotForm.newPaymentUI = true;
      JotForm.isFormViewTrackingAllowed = true;
      JotForm.replaceTagTest = true;
      JotForm.activeRedirect = "thanktext";
      JotForm.uploadServerURL = "https://upload.jotform.com/upload";
      JotForm.setConditions([{"action":[{"id":"action_1749695081614","visibility":"RequireMultiple","fields":["3","6","4","5"],"additionalRequireTypes":[],"isError":false}],"id":"1749695143746","index":"0","link":"Any","priority":"0","terms":[{"id":"term_1749695130018","field":"3","operator":"isEmpty","value":"","isError":false},{"id":"term_1749695122540","field":"6","operator":"isEmpty","value":"","isError":false},{"id":"term_1749695068740","field":"5","operator":"isEmpty","value":"","isError":false},{"id":"term_1749695035637","field":"4","operator":"isEmpty","value":"","isError":false}],"type":"require"}]);
      JotForm.clearFieldOnHide="disable";
      JotForm.submitError="jumpToFirstError";
      window.addEventListener('DOMContentLoaded',function(){window.brandingFooter.init({"formID":232718136914054,"campaign":"powered_by_jotform_le","isCardForm":false,"isLegacyForm":true,"formLanguage":"en"})});
      JotForm.isFullSource = true;
    `;
    this.executeInlineScript(jotformConfigScript);

    // --- Jotform Init Script ---
    const jotformInitScript = `
      JotForm.init(function(){
        /*INIT-START*/
        if (window.JotForm && JotForm.accessible) $('input_6').setAttribute('tabindex',0);
        if (window.JotForm && JotForm.accessible) $('input_5').setAttribute('tabindex',0);
        JotForm.alterTexts(undefined);
        /*INIT-END*/
      });
    `;
    this.executeInlineScript(jotformInitScript);

    // --- Jotform Payment/Extras Script ---
    const jotformExtrasScript = `
      setTimeout(function() {
        JotForm.paymentExtrasOnTheFly([null,{"name":"heading","qid":"1","text":"Contact Us","type":"control_head"},{"name":"submit","qid":"2","text":"Submit","type":"control_button"},{"description":"","name":"name","qid":"3","text":"Name","type":"control_fullname"},{"description":"","name":"email","qid":"4","subLabel":"example@example.com","text":"Email","type":"control_email"},{"description":"","mde":"No","name":"typeA","qid":"5","subLabel":"","text":"Body","type":"control_textarea","wysiwyg":"Disable"},{"description":"","name":"title","qid":"6","subLabel":"","text":"Title","type":"control_textbox"},null,null,null,null,{"name":"input11","qid":"11","text":"Thank you for reaching out!If you would like to contact us directly you can email us at info@cgca-ertoba.com and events@cgca-ertoba.com","type":"control_text"}]);
      }, 20);
    `;
    this.executeInlineScript(jotformExtrasScript);

    // --- Final SPC and Footer Scripts ---
    const jotformFinalScript = `
      JotForm.showJotFormPowered = "new_footer";
      JotForm.poweredByText = "Powered by Jotform";
      var all_spc = document.querySelectorAll("form[id='232718136914054'] .simple_spc");
      for (var i = 0; i < all_spc.length; i++) {
        all_spc[i].value = "232718136914054-232718136914054";
      }
      JotForm.ownerView=true;
      JotForm.isNewSACL=true;
    `;
    this.executeInlineScript(jotformFinalScript);
  }
}
