/**
 * This utility is part of my Angular utilities collection.
 *
 * Find more at: https://github.com/n1m4mz/Angular-Utilities
 *
 * Reusable across different projects.
 *
 * Created for maintaining and showcasing best practices.
 *
 * — n1m4mz (Thanks for checking it out!)
 */

import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// Define field types
export type FieldType = 'text' | 'number' | 'email' | 'password' | 'checkbox' | 'select' | 'radio';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  value?: any;
  options?: { label: string; value: any }[];
  validations?: any[];
}

@Injectable({ providedIn: 'root' })
export class DynamicFormService {
  constructor() {}

  createForm(fields: FieldConfig[]): FormGroup {
    const group: any = {};
    fields.forEach(field => {
      group[field.name] = new FormControl(field.value || '', field.validations || []);
    });
    return new FormGroup(group);
  }
}
