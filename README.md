# Proyecto con NestJS y Prisma

Este proyecto utiliza NestJS en el backend y Prisma como ORM para interactuar con una base de datos relacional. A continuación se explican los pasos para configurar y ejecutar el proyecto, así como inicializar las tablas en la base de datos usando Prisma.

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL, MySQL u otra base de datos compatible con Prisma
- Base de datos en ejecución y acceso a la misma
- Nest CLI (opcional pero recomendado)

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/AlexcodePB/OPENBREWERY_BACK.git
cd tu-repositorio
```

### 2. Instalar las Dependencias

```bash
npm install
```

### 3. Configurar la Base de Datos

Debes configurar el archivo `.env` en la raíz del proyecto para que Prisma pueda conectarse a tu base de datos. Un ejemplo de la configuración sería:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd"
```

### 4. Definir el Esquema de Prisma

Asegúrate de definir tus modelos en el archivo `prisma/schema.prisma`. Aquí tienes un ejemplo básico:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

### 5. Inicializar las Tablas en Prisma

**Generar el cliente de Prisma:**

```bash
npx prisma generate
```

**Ejecutar las migraciones para crear las tablas:**

```bash
npx prisma migrate dev --name init
```

### 6. Configurar Prisma en NestJS

Para integrar Prisma en tu proyecto NestJS, sigue estos pasos:

#### 1. Instalar las dependencias de Prisma para NestJS:

```bash
npm install @prisma/client
npm install @nestjs/prisma
```

#### 2. Crear un servicio para Prisma (`prisma.service.ts`) en tu directorio `src`:

```typescript
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

#### 3. Registrar el servicio en tu módulo principal (`app.module.ts` o `user.module.ts`):

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

### 7. Iniciar la Aplicación

Una vez que las tablas han sido creadas y Prisma está configurado en NestJS, puedes iniciar tu aplicación con el siguiente comando:

```bash
npm run start:dev
```

### 8. Trabajar con Prisma Client

Ahora puedes usar el cliente de Prisma para hacer consultas a tu base de datos desde tus controladores o servicios de NestJS. Por ejemplo, en un servicio `user.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
```

## Scripts Disponibles

- **`npm run start:dev`**: Inicia la aplicación en modo desarrollo.
- **`npx prisma studio`**: Abre Prisma Studio para interactuar con tu base de datos de manera gráfica.
- **`npx prisma migrate dev`**: Aplica migraciones en la base de datos.
- **`npx prisma generate`**: Genera el cliente de Prisma.

## Funcionalidades Implementadas

- Autenticación de usuarios
- Conexión a base de datos con Prisma
