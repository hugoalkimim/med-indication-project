import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Program extends Document {
  @Prop({ required: true })
  program_name: string;

  @Prop([String])
  coverage_eligibilities: string[];

  @Prop()
  program_type: string;

  @Prop([
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
    },
  ])
  requirements: { name: string; value: string }[];

  @Prop([
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
    },
  ])
  benefits: { name: string; value: string }[];

  @Prop([
    {
      name: { type: String, required: true },
      link: { type: String, required: true },
    },
  ])
  forms: { name: string; link: string }[];

  @Prop({
    type: {
      evergreen: { type: String },
      current_funding_level: { type: String },
    },
  })
  funding: {
    evergreen?: string;
    current_funding_level?: string;
  };

  @Prop([
    {
      eligibility: { type: String },
      program: { type: String },
      renewal: { type: String },
      income: { type: String },
    },
  ])
  details: {
    eligibility?: string;
    program?: string;
    renewal?: string;
    income?: string;
  }[];
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
