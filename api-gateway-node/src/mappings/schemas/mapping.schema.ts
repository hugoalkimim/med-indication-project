import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Indication {
  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  icd10: string;
}

export const IndicationSchema = SchemaFactory.createForClass(Indication);

@Schema({ timestamps: true })
export class Mapping extends Document {
  @Prop({ required: true })
  medication: string;

  @Prop({ type: [IndicationSchema], required: true })
  indications: Indication[];
}

export const MappingSchema = SchemaFactory.createForClass(Mapping);
