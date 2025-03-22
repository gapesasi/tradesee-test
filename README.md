# API de Clima e Capitais

Este projeto é uma API RESTful desenvolvida para fornecer informações humanizadas sobre o clima em capitais brasileiras. O principal objetivo deste projeto é demonstrar habilidades técnicas, aplicando os princípios da Clean Architecture, boas práticas de desenvolvimento e testes unitários.

Para obter os dados climáticos, foi utilizada a API pública **OpenMetheo** por meio da biblioteca **Axios**. Dessa forma, o projeto integra dados reais e atualizados, transformando-os em informações amigáveis e de fácil interpretação para os usuários.

Durante o desenvolvimento, adotei a Clean Architecture para garantir um código modular, organizado e de fácil manutenção. Embora essa abordagem seja especialmente valiosa para sistemas com escalabilidade prevista, neste projeto ela foi aplicada para demonstrar o domínio da metodologia sem adicionar complexidade desnecessária. Além disso, foram implementados tratamento de erros personalizados e testes unitários para assegurar a robustez da solução.

## Tecnologias Utilizadas

- Express
- TypeScript
- TypeORM
- MySQL
- Jest
- Docker
- Axios

## Como Começar

### Pré-requisitos

- Node.js
- Docker

### Instalação

1. Clone o repositório:

    ```shell
    git clone https://github.com/gapesasi/tradesee-test.git
    cd tradesee-test
    ```

2. Crie o arquivo `.env` baseado no arquivo `.env.example` e preencha os seguintes parâmetros:

    ```dotenv
    DATABASE_NAME=
    DATABASE_PASSWORD=
    DATABASE_USERNAME=
    ```

3. Inicie os containers Docker:

    ```shell
    npm run docker
    ```

> **Observação:**  
> As migrações são executadas automaticamente ao iniciar os containers. O container do servidor só ficará disponível após o container do banco de dados finalizar sua inicialização corretamente.

## Endpoints da API

### 1. **GET /weather**

Recebe, através dos query params, **ou o nome** de uma capital brasileira ou **seu respectivo ID** no banco de dados e retorna dicas humanizadas sobre o clima.

#### Query Params

| Parâmetro | Tipo     | Descrição                                                                  |
| --------- | -------- | -------------------------------------------------------------------------- |
| `id`      | `number` | **Opcional.** Identificador da capital no banco de dados.                  |
| `name`    | `string` | **Opcional.** Nome da capital para consulta.                               |

#### Exemplo de Resultado

```json
{
    "thermalComfort": "✅ Conforto térmico: O clima está ameno.",
    "bestOutdoorTime": "🌤 Melhor horário para atividades ao ar livre: 07:00 (Temperatura: 20.1°C, horário GMT-3).",
    "clothingRecommendation": "👕 Sugestão de vestuário: Vista-se confortavelmente. 🌧️ E lembre-se de levar um guarda-chuva.",
    "climateRiskLevel": "⚠️ Nível de risco climático: Baixo",
    "airQualityRecommendation": "🌍 Qualidade do ar: Boa. Aproveite o dia ao ar livre!",
    "rainProbabilityAnalysis": "🌧️ Chance alta de chuva entre os horários 13:00, 14:00, 15:00, 16:00, 17:00. Chance média de chuva nos horários 12:00, 18:00."
}
```

### 1. **GET /state-capitals**

Retorna a lista completa das capitais brasileiras, com informações de geolocalização e faixa de temperatura.

## Testes

Para executar os testes unitários, utilize o seguinte comando:

```shell
npm run test
```
