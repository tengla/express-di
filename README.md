# express-di

Express DI Demo with Service-Oriented Architecture

## Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/server.ts
```

## Architecture Guidelines

This project demonstrates a service-oriented architecture using dependency injection with Awilix. The `src/routes/appointments` module serves as a reference implementation.

### Route Structure

Each feature module should follow this structure:

```
src/routes/feature/
├── index.ts          # Route configuration and DI container setup
├── api.ts            # API controller classes
├── services/         # Service implementations
│   ├── primary.ts    # Primary service implementation
│   ├── secondary.ts  # Alternative service implementation
│   └── fallback.ts   # Fallback service implementation
└── types/
    └── service.ts    # Interface definitions
```

### Dependency Injection Pattern

#### 1. Service Interface (`src/types/service.ts`)

Define a common interface that all service implementations must follow:

```typescript
export interface ServiceName {
  methodName(param: string): Promise<ReturnType>;
}
```

#### 2. Service Implementations (`src/routes/feature/services/`)

Create multiple implementations of the same interface:

```typescript
export class PrimaryService implements ServiceName {
  public methodName(param: string) {
    // Primary implementation logic
    return Promise.resolve(result);
  }
}
```

#### 3. API Controller (`src/routes/feature/api.ts`)

Create a controller class that depends on the service interface:

```typescript
type APICtor = {
  serviceName: ServiceName;
  currentUser?: { id: string };
};

export class FeatureAPI {
  constructor({ serviceName, currentUser }: APICtor) {
    // Dependency injection via constructor
  }
  
  public async handleRequest(req: Request, res: Response) {
    // Use injected dependencies
  }
}
```

#### 4. Route Configuration (`src/routes/feature/index.ts`)

Set up the DI container and route handling:

```typescript
const container = createContainer();

// Register default dependencies
container.register({
  serviceName: asClass(DefaultService),
  currentUser: asValue(null),
});

const router = express.Router();
router.use(scopePerRequest(container));

// Authentication middleware
router.use((req, res, next) => {
  req.container = container.createScope();
  req.container.register({
    currentUser: asValue(req.user),
  });
  next();
});

// Service selection middleware
router.use("/:param", (req, res, next) => {
  const { param } = req.params;
  
  // Conditionally register different service implementations
  if (condition1) {
    req.container.register({
      serviceName: asClass(AlternativeService),
    });
  }
  if (condition2) {
    req.container.register({
      serviceName: asClass(FallbackService),
    });
  }
  next();
});

// Route handlers
router.get("/:param", (req, res) => {
  const api = new FeatureAPI(req.container.cradle);
  api.handleRequest(req, res);
});
```

### Key Patterns

1. **Interface Segregation**: Define clean interfaces for services
2. **Dependency Injection**: Use Awilix for constructor injection
3. **Scoped Containers**: Create request-scoped containers for user context
4. **Service Selection**: Use middleware to conditionally register services
5. **Separation of Concerns**: Keep API logic separate from service logic

### Benefits

- **Testability**: Easy to mock dependencies for unit testing
- **Flexibility**: Switch service implementations based on runtime conditions
- **Maintainability**: Clear separation between API controllers and business logic
- **Scalability**: Easy to add new service implementations without changing existing code
