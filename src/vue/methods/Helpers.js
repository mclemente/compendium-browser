import { Progress } from "../../module/progress.js";

export function getSafeValue(property, defaultValue) {
  if (property) return property.value;
  return defaultValue;
}

export function cssClass(string) {
  return encodeURIComponent(
    string.trim().toLowerCase()
  ).replace(/%[0-9A-F]{2}/gi, "-");
}

export function numberFormat(value, dec = 0, sign = false) {
  value = parseFloat(value).toFixed(dec);
  if (sign ) return ( value >= 0 ) ? `+${value}` : value;
  return value;
}

export function concat(...args) {
  return args.reduce((acc, cur) => {
    return acc + cur;
  }, "");
}

export async function getActor(actorData) {
  // If no drag data is available, we can't retrieve the actor.
  if (!actorData?.dragData?.uuid) return false;

  // Async load the actor/token from the UUID.
  const document = await fromUuid(actorData.dragData.uuid);

  // If it's a token, retrieve the actor prop. Otherwise, retrieve the document.
  return document?.actor ?? document;
}

/**
 * Retrieve module art for an actor
 *
 * @param {object} actor Index version of an actor document from a compendium.
 * @returns {string} Path to art asset
 */
export function getActorModuleArt(actor) {
  // UUID doesn't exactly match the format used in the map currently.
  const actorMapId = actor.uuid.replace(".Actor", "");
  // Retrieve the art from the map, or fallback to the actor image.
  const art = game.dnd5e.moduleArt.map.get(actorMapId);
  return art?.actor ?? actor.img;
}

/**
 * Retrieve index for a list of compendiums.
 *
 * @param {Array} packNames Array of compendiums to index.
 * @param {Array} fields Array of field paths to include in the index.
 * @returns Combined entries from the queried compendiums.
 */
export async function getPackIndex({ packNames = [], fields = [], types = [], subTypes = [] } = {}) {
  if (!packNames || !fields || fields.length < 1) return [];

  let packs = [];

  if (!packNames.length) {
    packNames = game.packs.contents
      .filter((p) => !types.length || types.includes(p.metadata.type))
      .map((p) => p.metadata.id);
  }
  const progress = new Progress({ max: packNames.length });

  if (subTypes.length && !fields.includes("type")) {
    fields.push("type");
  }

  for (let packName of packNames) {
    const pack = game.packs.get(packName);
    const packIndex = await pack.getIndex({ fields });
    const filteredIndexes = packIndex.contents
      .filter((i) => !subTypes.length || subTypes.includes(i.type));
    packs = packs.concat(filteredIndexes);
    progress.advance({ label: game.i18n.format("CMPBrowser.LoadingPack", { pack: pack.metadata.label })});
  }
  progress.close({ label: game.i18n.localize("CMPBrowser.LoadingComplete") });

  return packs;
}

/**
 * Open a document's sheet based on its uuid.
 *
 * @param {string} uuid Document UUID to open.
 * @param {string} type Document type to open. Defaults to 'Actor'.
 */
export function openDocument(uuid, type = "Actor") {
  getDocumentClass(type).fromDropData({
    type: type,
    uuid: uuid
  }).then((document) => {
    if (document?.sheet) {
      document.sheet.render(true);
    }
    else {
      console.warn(`No document found for ${uuid}`);
    }
  });
}

/**
 * Starts a drag event and provides document drop data.
 *
 * @param {Event} event Drag event.
 * @param {Object} entry Pack index entry object.
 */
export function startDrag(event, entry, type = "Actor") {
  event.dataTransfer.setData("text/plain", JSON.stringify({
    type: type,
    uuid: entry.uuid
  }));
}

export function sortPackValues(packValue, sort = true) {
  let sortable = Object.entries(packValue)
    .filter(([key, data]) => key !== undefined && data !== undefined)
    .map(([key, data]) => {
      if (typeof data === "string") return [key, game.i18n.localize(data)];
      return [key, data.label];
    });

  if (sort) sortable = sortable.sort((a, b) => a[1].localeCompare(b[1]));

  return sortable.reduce((acc, item) => {
    acc[item[0]] = item[1];
    return acc;
  }, {});
}
