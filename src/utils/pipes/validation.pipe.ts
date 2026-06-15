import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema, Schema } from 'joi';

@Injectable()
export class JoiObjectValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema | Schema) {}
  async transform(data: unknown): Promise<void> {
    try {
      // Handle empty/undefined body - convert to empty object for validation
      const dataToValidate =
        !data || (typeof data === 'object' && Object.keys(data).length === 0)
          ? {}
          : data;

      const value = await this.schema.validateAsync(dataToValidate, {
        stripUnknown: true,
        presence: 'optional', // Make all fields optional by default
      });

      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
