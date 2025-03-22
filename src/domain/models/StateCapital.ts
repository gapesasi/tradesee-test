import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import TemperatureRange from "./TemperatureRange"

@Entity()
export default class StateCapital {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    state: string

    @Column()
    latitude: string

    @Column()
    longitude: string

    @ManyToOne(() => TemperatureRange, { nullable: true })
    @JoinColumn({ name: 'id_temperature_range' })
    temperatureRange: TemperatureRange;

    @Column({type: "integer", name: "id_temperature_range"})
    idTemperatureRange: number
}