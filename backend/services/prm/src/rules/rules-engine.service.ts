/**
 * Rules Engine Service
 * JSON DSL evaluator (UNCHANGED from Express version)
 */

import { Injectable, Logger } from '@nestjs/common';

export interface ConditionExpr {
  and?: ConditionExpr[];
  or?: ConditionExpr[];
  not?: ConditionExpr;
  field?: string;
  op?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'contains' | 'exists';
  value?: any;
}

export interface EvaluationContext {
  event: {
    event_type: string;
    event_subtype?: string;
    payload: Record<string, any>;
    occurred_at: Date;
    severity: number;
  };
  patient: {
    patient_id: string;
    age_years_at_event?: number;
    gender?: string;
    ref?: string;
  };
  preferences?: {
    quiet_hours_start?: string;
    quiet_hours_end?: string;
    dnd_enabled?: boolean;
    channel_order?: string[];
  };
}

@Injectable()
export class RulesEngineService {
  private readonly logger = new Logger(RulesEngineService.name);

  evaluateCondition(expr: ConditionExpr, context: EvaluationContext): boolean {
    try {
      return this._evaluate(expr, context);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Condition evaluation failed: ${errorMessage}`);
      return false;
    }
  }

  private _evaluate(expr: ConditionExpr, context: EvaluationContext): boolean {
    if (expr.and) {
      return expr.and.every((subExpr) => this._evaluate(subExpr, context));
    }

    if (expr.or) {
      return expr.or.some((subExpr) => this._evaluate(subExpr, context));
    }

    if (expr.not) {
      return !this._evaluate(expr.not, context);
    }

    if (expr.field && expr.op) {
      const fieldValue = this._getFieldValue(expr.field, context);
      return this._compareValues(fieldValue, expr.op, expr.value);
    }

    this.logger.warn('Invalid condition expression');
    return false;
  }

  private _getFieldValue(field: string, context: EvaluationContext): any {
    const parts = field.split('.');
    let value: any = context;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }

  private _compareValues(fieldValue: any, op: string, expectedValue: any): boolean {
    switch (op) {
      case 'eq':
      case '=':
        return fieldValue === expectedValue;
      case 'ne':
      case '!=':
        return fieldValue !== expectedValue;
      case 'gt':
      case '>':
        return this._isNumber(fieldValue) && this._isNumber(expectedValue) && fieldValue > expectedValue;
      case 'gte':
      case '>=':
        return this._isNumber(fieldValue) && this._isNumber(expectedValue) && fieldValue >= expectedValue;
      case 'lt':
      case '<':
        return this._isNumber(fieldValue) && this._isNumber(expectedValue) && fieldValue < expectedValue;
      case 'lte':
      case '<=':
        return this._isNumber(fieldValue) && this._isNumber(expectedValue) && fieldValue <= expectedValue;
      case 'in':
        return Array.isArray(expectedValue) && expectedValue.includes(fieldValue);
      case 'not_in':
        return Array.isArray(expectedValue) && !expectedValue.includes(fieldValue);
      case 'contains':
        if (typeof fieldValue === 'string' && typeof expectedValue === 'string') {
          return fieldValue.includes(expectedValue);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(expectedValue);
        }
        return false;
      case 'exists':
        return expectedValue ? fieldValue !== undefined && fieldValue !== null : fieldValue === undefined || fieldValue === null;
      default:
        this.logger.warn(`Unknown operator: ${op}`);
        return false;
    }
  }

  private _isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }
}
