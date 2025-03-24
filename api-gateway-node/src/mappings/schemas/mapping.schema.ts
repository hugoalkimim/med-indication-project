import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Mapping extends Document {
  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  icd10: string;

  @Prop()
  description?: string;
}

export const MappingSchema = SchemaFactory.createForClass(Mapping);