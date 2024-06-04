import { ObjectId } from "mongo";
import {
  CochesCollection,
  ConcesionariosCollection,
  VendedoresCollection,
} from "../db/dbconnection.ts";
import {
  CocheSchema,
  ConcesionarioSchema,
  VendedorSchema,
} from "../db/schema.ts";

export const Query = {
  getConcesionarioPorId: async (
    _: unknown,
    args: { id: string }
  ): Promise<ConcesionarioSchema | null> => {
    try {
      const concesionarioEncontrado: ConcesionarioSchema | undefined =
        await ConcesionariosCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!concesionarioEncontrado) {
        throw new Error("No existe un concesionario con esa ID");
      }

      return {
        _id: concesionarioEncontrado._id,
        localidad: concesionarioEncontrado.localidad,
        vendedores: concesionarioEncontrado.vendedores,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  getConcesionarioPorLocalidad: async (
    _: unknown,
    args: { localidad: string }
  ): Promise<ConcesionarioSchema[]> => {
    try {
      const concesionarioEncontrado: ConcesionarioSchema[] | undefined =
        await ConcesionariosCollection.find({
          localidad: args.localidad,
        }).toArray();

      if (!concesionarioEncontrado) {
        throw new Error("No existe un concesionario en esa localidad");
      }

      return concesionarioEncontrado.map(
        (concesionario: ConcesionarioSchema) => {
          return {
            _id: concesionario._id,
            localidad: concesionario.localidad,
            vendedores: concesionario.vendedores,
          };
        }
      );
    } catch (error) {
      throw new Error(error);
    }
  },

  getVendedorPorId: async (
    _: unknown,
    args: { id: string }
  ): Promise<VendedorSchema | null> => {
    try {
      const vendedorEncontrado: VendedorSchema | undefined =
        await VendedoresCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!vendedorEncontrado) {
        throw new Error("Vendedor no encontrado");
      }

      return {
        _id: vendedorEncontrado._id,
        name: vendedorEncontrado.name,
        dni: vendedorEncontrado.dni,
        coches: vendedorEncontrado.coches,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  getVendedorPorNombre: async (
    _: unknown,
    args: { name: string }
  ): Promise<VendedorSchema[]> => {
    try {
      const vendedoresEncontrados: VendedorSchema[] =
        await VendedoresCollection.find({
          name: args.name,
        }).toArray();

      if (!vendedoresEncontrados) {
        throw new Error("Vendedores con ese nombre no existentes");
      }

      return vendedoresEncontrados.map((vendedor: VendedorSchema) => {
        return {
          _id: vendedor._id,
          name: vendedor.name,
          dni: vendedor.dni,
          coches: vendedor.coches,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  getCochePorId: async (
    _: unknown,
    args: { id: string }
  ): Promise<CocheSchema | null> => {
    try {
      const cocheEncontrado: CocheSchema | undefined =
        await CochesCollection.findOne({
          _id: new ObjectId(args.id),
        });

      if (!cocheEncontrado) {
        throw new Error("Coche no encontrado");
      }

      return {
        _id: cocheEncontrado._id,
        marca: cocheEncontrado.marca,
        matricula: cocheEncontrado.matricula,
        asientos: cocheEncontrado.asientos,
        precio: cocheEncontrado.precio,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  
  getCochePorRangoPrecio: async (
    _: unknown,
    args: { precioMin: number; precioMax: number }
  ): Promise<CocheSchema[]> => {
    try {
      if (args.precioMin < 0 || args.precioMax < 0) {
        throw new Error(
          "El parametro precioMin o precioMax no pueden tener valores negativos"
        );
      }

      const cochesEncontrados: CocheSchema[] = await CochesCollection.find({
        precio: {
          $gte: args.precioMin,
          $lte: args.precioMax,
        },
      }).toArray();

      if (!cochesEncontrados) {
        throw new Error("No hay coches en ese rango de precio");
      }

      if (args.precioMin < 0 || args.precioMax < 0) {
        throw new Error(
          "El precio minimo o el precio maximo no pueden ser negativos"
        );
      }

      if (args.precioMax < args.precioMin) {
        throw new Error("El precio maximo es menor que el precio minimo");
      }

      return cochesEncontrados.map((coche: CocheSchema) => {
        return {
          _id: coche._id,
          marca: coche.marca,
          matricula: coche.matricula,
          asientos: coche.asientos,
          precio: coche.precio,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
