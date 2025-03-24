import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Mapping extends Document {
  @Prop([
    {
      condition: { type: String, required: true },
      icd10: { type: String, required: true },
      description: { type: String },
    },
  ])
  indications: { condition: string; icd10: string; description?: string }[];
}

export const MappingSchema = SchemaFactory.createForClass(Mapping);