import { MigrationInterface, QueryRunner } from "typeorm";

export default class CreateTables1711042876543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE temperature_range (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(10) CHECK (name IN ('cold', 'warm', 'hot')) NOT NULL DEFAULT 'cold',
            min_temperature FLOAT NOT NULL,
            max_temperature FLOAT NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE state_capital (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL,
            latitude VARCHAR(255) NOT NULL,
            longitude VARCHAR(255) NOT NULL,
            id_temperature_range INTEGER NOT NULL,
            CONSTRAINT fk_temperature_range FOREIGN KEY (id_temperature_range) REFERENCES temperature_range(id) ON DELETE CASCADE
        );
    `);

    await queryRunner.query(`
        INSERT INTO temperature_range (name, min_temperature, max_temperature) VALUES
        ('cold', 10, 20),
        ('warm', 20, 30),
        ('hot', 30, 40);
    `);

    await queryRunner.query(`
        INSERT INTO state_capital (name, state, latitude, longitude, id_temperature_range) VALUES
        ('Rio Branco', 'AC', '-9.97499', '-67.8243', 2),
        ('Maceió', 'AL', '-9.66599', '-35.735', 2),
        ('Macapá', 'AP', '0.03493', '-51.0664', 2),
        ('Manaus', 'AM', '-3.10719', '-60.0261', 3),
        ('Salvador', 'BA', '-12.9714', '-38.5014', 3),
        ('Fortaleza', 'CE', '-3.71722', '-38.5431', 3),
        ('Brasília', 'DF', '-15.7795', '-47.9297', 2),
        ('Vitória', 'ES', '-20.3155', '-40.3128', 2),
        ('Goiânia', 'GO', '-16.6799', '-49.255', 2),
        ('São Luís', 'MA', '-2.52972', '-44.3028', 3),
        ('Cuiabá', 'MT', '-15.5989', '-56.0949', 3),
        ('Campo Grande', 'MS', '-20.4428', '-54.6464', 2),
        ('Belo Horizonte', 'MG', '-19.8157', '-43.9542', 2),
        ('Belém', 'PA', '-1.45502', '-48.5024', 3),
        ('João Pessoa', 'PB', '-7.1195', '-34.8456', 3),
        ('Curitiba', 'PR', '-25.4195', '-49.2646', 1),
        ('Recife', 'PE', '-8.04756', '-34.877', 3),
        ('Teresina', 'PI', '-5.08917', '-42.8019', 3),
        ('Rio de Janeiro', 'RJ', '-22.9035', '-43.2096', 2),
        ('Natal', 'RN', '-5.79448', '-35.211', 3),
        ('Porto Alegre', 'RS', '-30.0346', '-51.2177', 1),
        ('Porto Velho', 'RO', '-8.76194', '-63.9039', 3),
        ('Boa Vista', 'RR', '2.82384', '-60.6753', 2),
        ('Florianópolis', 'SC', '-27.5954', '-48.548', 1),
        ('São Paulo', 'SP', '-23.5505', '-46.6333', 2),
        ('Aracaju', 'SE', '-10.9472', '-37.0731', 3),
        ('Palmas', 'TO', '-10.1689', '-48.3317', 2);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE state_capital`);
    await queryRunner.query(`DROP TABLE temperature_range`);
  }
}
