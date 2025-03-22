import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum TemperatureRangeName {
  COLD = "cold",
  WARM = "warm",
  HOT = "hot",
}

@Entity()
export default class TemperatureRange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("enum", { enum: TemperatureRangeName, default: TemperatureRangeName.COLD })
  name: TemperatureRangeName;

  @Column({type: "float", name: "min_temperature"})
  minTemperature: number;

  @Column({type: "float", name: "max_temperature"})
  maxTemperature: number;
}
