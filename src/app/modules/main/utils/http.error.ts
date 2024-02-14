import {HttpErrorResponse} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {IResponseError} from "../models/response";

export function prepareFormHttpError(err: HttpErrorResponse, form: FormGroup){
  if (!err.error || err.status >= 500){
    return;
  }

  const response_error = err.error as IResponseError;

  Object.entries(response_error.detail).forEach(
    ([key, err]) => {
      if (key === "non_field_errors")
        form.setErrors({'server': err});
      else if (form.get(key)) {
        form.get(key).setErrors({'server': err});
      }
    }
  );
}
