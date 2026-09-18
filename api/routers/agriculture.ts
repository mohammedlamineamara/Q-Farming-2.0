import { z } from "zod";
import { createRouter, authedQuery, adminMutation } from "../middleware";
import { agricultureRepo } from "../agriculture/repository";
import { TRPCError } from "@trpc/server";

export const agricultureRouter = createRouter({
  getCrops: authedQuery
    .input(
      z
        .object({
          category: z.string().optional(),
          query: z.string().optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      return agricultureRepo.getAllCrops(input);
    }),

  getCropById: authedQuery
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const crop = agricultureRepo.getCropById(input.id);
      if (!crop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Crop not found with id: ${input.id}`,
        });
      }
      const afflictions = agricultureRepo.getAfflictionsForCrop(crop.id);
      const sources = crop.sources
        .map((sId) => agricultureRepo.getSourceById(sId))
        .filter((s): s is NonNullable<typeof s> => s !== null);
      const wilayas = crop.primaryWilayas
        .map((code) => agricultureRepo.getWilayaByCode(code))
        .filter((w): w is NonNullable<typeof w> => w !== null);

      return {
        ...crop,
        resolvedAfflictions: afflictions,
        resolvedSources: sources,
        resolvedWilayas: wilayas,
      };
    }),

  getAfflictions: authedQuery
    .input(
      z
        .object({
          cropId: z.string().optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      if (input?.cropId) {
        return agricultureRepo.getAfflictionsForCrop(input.cropId);
      }
      return agricultureRepo.getAllAfflictions();
    }),

  getAfflictionById: authedQuery
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const affliction = agricultureRepo.getAfflictionById(input.id);
      if (!affliction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Affliction not found with id: ${input.id}`,
        });
      }
      return affliction;
    }),

  getSources: authedQuery.query(() => {
    return agricultureRepo.getAllSources();
  }),

  getSourceById: authedQuery
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const source = agricultureRepo.getSourceById(input.id);
      if (!source) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Source not found with id: ${input.id}`,
        });
      }
      return source;
    }),

  getWilayas: authedQuery.query(() => {
    return agricultureRepo.getAllWilayas();
  }),

  getWilayaByCode: authedQuery
    .input(z.object({ code: z.string() }))
    .query(({ input }) => {
      const wilaya = agricultureRepo.getWilayaByCode(input.code);
      if (!wilaya) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Wilaya not found with code: ${input.code}`,
        });
      }
      return wilaya;
    }),

  adminCreateCrop: adminMutation
    .input(
      z.object({
        id: z.string().min(1),
        slug: z.string().min(1),
        name: z.object({
          en: z.string().min(1),
          ar: z.string().min(1),
          fr: z.string().min(1),
        }),
        scientificName: z.string().min(1),
        family: z.string().min(1),
        category: z.enum(["cereal", "legume", "fruit_tree", "vegetable", "forage", "industrial"]),
        description: z.object({
          en: z.string(),
          ar: z.string(),
          fr: z.string(),
        }),
        varieties: z.array(z.any()).default([]),
        calendar: z.array(z.any()).default([]),
        primaryWilayas: z.array(z.string()).default([]),
        requirements: z.object({
          optimalTempMin: z.number(),
          optimalTempMax: z.number(),
          waterNeedsMm: z.number(),
          soilTypes: z.object({
            en: z.string(),
            ar: z.string(),
            fr: z.string(),
          }),
          droughtTolerance: z.enum(["low", "moderate", "high"]),
          salinityTolerance: z.enum(["low", "moderate", "high"]),
        }),
        afflictionIds: z.array(z.string()).default([]),
        sources: z.array(z.string()).default([]),
      })
    )
    .mutation(({ ctx, input }) => {
      return agricultureRepo.adminAddCrop(input as unknown as Parameters<typeof agricultureRepo.adminAddCrop>[0], ctx.user.role);
    }),

  adminUpdateCrop: adminMutation
    .input(
      z.object({
        id: z.string(),
        data: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(({ ctx, input }) => {
      return agricultureRepo.adminUpdateCrop(input.id, input.data, ctx.user.role);
    }),
});
