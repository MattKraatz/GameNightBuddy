# Conventions
The following conventions are required in models and contexts to ensure proper migrations are created by Entity Framework.

## Commands

In Powershell
- dotnet ef migrations add <MigrationName>
- dotnet ef migrations remove
- dotnet ef database update

## Primary Key

- All models must have a Guid property titled `<model-name>Id`
- These are automatically setup with values generated on add

## Foreign Keys
### One-to-Many Relationships

- One-side: define a Guid of the foreign object's primary key
- One-side: define a typed property of the foreign object's type
- One-side: add the [Required] attribute to the foreign object's primary key as necessary
- Many-side: define a list of the foreign object's type

## Generated Properties

- Define via fluent API in the Context.cs file
- Use SQL properties where possible
- Primary Keys of type `Guid` or `int` are automatically setup with values generated on add

## Required properties

- Primary Keys are required by default
- Use [Required] attribute on otherwise required values
- Declare optional number values as nullable with `?`

## Indexes

- Foreign Keys are automatically indexed
- Define indexes via Fluent API as necessary