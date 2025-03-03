import {
  getState,
  patchState,
  signalStoreFeature,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState
} from "./chunk-SIGW5MMF.js";
import {
  isPlatformBrowser,
  isPlatformServer
} from "./chunk-HRMWXWEU.js";
import {
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  isDevMode,
  isSignal,
  setClassMetadata,
  signal,
  untracked,
  ɵɵdefineInjectable
} from "./chunk-ZXNQQMV3.js";
import {
  Subject
} from "./chunk-P6U2JBMQ.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@ngrx/signals/fesm2022/ngrx-signals-entities.mjs
var DidMutate;
(function(DidMutate2) {
  DidMutate2[DidMutate2["None"] = 0] = "None";
  DidMutate2[DidMutate2["Entities"] = 1] = "Entities";
  DidMutate2[DidMutate2["Both"] = 2] = "Both";
})(DidMutate || (DidMutate = {}));
var defaultSelectId = (entity) => entity.id;
function getEntityIdSelector(config) {
  return config?.selectId ?? defaultSelectId;
}
function getEntityStateKeys(config) {
  const collection = config?.collection;
  const entityMapKey = collection === void 0 ? "entityMap" : `${collection}EntityMap`;
  const idsKey = collection === void 0 ? "ids" : `${collection}Ids`;
  const entitiesKey = collection === void 0 ? "entities" : `${collection}Entities`;
  return {
    entityMapKey,
    idsKey,
    entitiesKey
  };
}
function cloneEntityState(state, stateKeys) {
  return {
    entityMap: __spreadValues({}, state[stateKeys.entityMapKey]),
    ids: [...state[stateKeys.idsKey]]
  };
}
function getEntityUpdaterResult(state, stateKeys, didMutate) {
  switch (didMutate) {
    case DidMutate.Both: {
      return {
        [stateKeys.entityMapKey]: state.entityMap,
        [stateKeys.idsKey]: state.ids
      };
    }
    case DidMutate.Entities: {
      return {
        [stateKeys.entityMapKey]: state.entityMap
      };
    }
    default: {
      return {};
    }
  }
}
function addEntityMutably(state, entity, selectId) {
  const id = selectId(entity);
  if (state.entityMap[id]) {
    return DidMutate.None;
  }
  state.entityMap[id] = entity;
  state.ids.push(id);
  return DidMutate.Both;
}
function setEntityMutably(state, entity, selectId) {
  const id = selectId(entity);
  if (state.entityMap[id]) {
    state.entityMap[id] = entity;
    return DidMutate.Entities;
  }
  state.entityMap[id] = entity;
  state.ids.push(id);
  return DidMutate.Both;
}
function setEntitiesMutably(state, entities, selectId) {
  let didMutate = DidMutate.None;
  for (const entity of entities) {
    const result = setEntityMutably(state, entity, selectId);
    if (didMutate === DidMutate.Both) {
      continue;
    }
    didMutate = result;
  }
  return didMutate;
}
function removeEntitiesMutably(state, idsOrPredicate) {
  const ids = Array.isArray(idsOrPredicate) ? idsOrPredicate : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let didMutate = DidMutate.None;
  for (const id of ids) {
    if (state.entityMap[id]) {
      delete state.entityMap[id];
      didMutate = DidMutate.Both;
    }
  }
  if (didMutate === DidMutate.Both) {
    state.ids = state.ids.filter((id) => id in state.entityMap);
  }
  return didMutate;
}
function updateEntitiesMutably(state, idsOrPredicate, changes, selectId) {
  const ids = Array.isArray(idsOrPredicate) ? idsOrPredicate : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let newIds = void 0;
  let didMutate = DidMutate.None;
  for (const id of ids) {
    const entity = state.entityMap[id];
    if (entity) {
      const changesRecord = typeof changes === "function" ? changes(entity) : changes;
      state.entityMap[id] = __spreadValues(__spreadValues({}, entity), changesRecord);
      didMutate = DidMutate.Entities;
      const newId = selectId(state.entityMap[id]);
      if (newId !== id) {
        state.entityMap[newId] = state.entityMap[id];
        delete state.entityMap[id];
        newIds = newIds || {};
        newIds[id] = newId;
      }
    }
  }
  if (newIds) {
    state.ids = state.ids.map((id) => newIds[id] ?? id);
    didMutate = DidMutate.Both;
  }
  if (ngDevMode && state.ids.length !== Object.keys(state.entityMap).length) {
    console.warn("@ngrx/signals/entities: Entities with IDs:", ids, "are not updated correctly.", "Make sure to apply valid changes when using `updateEntity`,", "`updateEntities`, and `updateAllEntities` updaters.");
  }
  return didMutate;
}
function addEntity(entity, config) {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntityMutably(clonedState, entity, selectId);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
function removeEntity(id, config) {
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = removeEntitiesMutably(clonedState, [id]);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
function setAllEntities(entities, config) {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);
  return () => {
    const state = {
      entityMap: {},
      ids: []
    };
    setEntitiesMutably(state, entities, selectId);
    return {
      [stateKeys.entityMapKey]: state.entityMap,
      [stateKeys.idsKey]: state.ids
    };
  };
}
function updateEntity(update, config) {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(clonedState, [update.id], update.changes, selectId);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// node_modules/@angular-architects/ngrx-toolkit/fesm2022/angular-architects-ngrx-toolkit.mjs
var withDevToolsStub = () => (store) => store;
var currentActionNames = /* @__PURE__ */ new Set();
function throwIfNull(obj) {
  if (obj === null || obj === void 0) {
    throw new Error("");
  }
  return obj;
}
var dummyConnection = {
  send: () => void 0
};
var DevtoolsSyncer = class _DevtoolsSyncer {
  /**
   * Stores all SignalStores that are connected to the
   * DevTools along their options, names and id.
   */
  #stores = {};
  #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  #trackers = [];
  /**
   * Maintains the current states of all stores to avoid conflicts
   * between glitch-free and glitched trackers when used simultaneously.
   *
   * The challenge lies in ensuring that glitched trackers do not
   * interfere with the synchronization process of glitch-free trackers.
   * Specifically, glitched trackers could cause the synchronization to
   * read the current state of stores managed by glitch-free trackers.
   *
   * Therefore, the synchronization process doesn't read the state from
   * each store, but relies on #currentState.
   *
   * Please note, that here the key is the name and not the id.
   */
  #currentState = {};
  #currentId = 1;
  #connection = this.#isBrowser ? window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: "NgRx SignalStore"
  }) : dummyConnection : dummyConnection;
  constructor() {
    if (!this.#isBrowser) {
      return;
    }
    const isToolkitAvailable = Boolean(window.__REDUX_DEVTOOLS_EXTENSION__);
    if (!isToolkitAvailable) {
      console.info("NgRx Toolkit/DevTools: Redux DevTools Extension is not available.");
    }
  }
  ngOnDestroy() {
    currentActionNames.clear();
  }
  syncToDevTools(changedStatePerId) {
    const mappedChangedStatePerName = Object.entries(changedStatePerId).reduce((acc, [id, store]) => {
      const {
        options,
        name
      } = this.#stores[id];
      acc[name] = options.map(store);
      return acc;
    }, {});
    this.#currentState = __spreadValues(__spreadValues({}, this.#currentState), mappedChangedStatePerName);
    const names = Array.from(currentActionNames);
    const type = names.length ? names.join(", ") : "Store Update";
    currentActionNames.clear();
    this.#connection.send({
      type
    }, this.#currentState);
  }
  getNextId() {
    return String(this.#currentId++);
  }
  /**
   * Consumer provides the id. That is because we can only start
   * tracking the store in the init hook.
   * Unfortunately, methods for renaming having the final id
   * need to be defined already before.
   * That's why `withDevtools` requests first the id and
   * then registers itself later.
   */
  addStore(id, name, store, options) {
    let storeName = name;
    const names = Object.values(this.#stores).map((store2) => store2.name);
    if (names.includes(storeName)) {
      if (!options.indexNames) {
        throw new Error(`An instance of the store ${storeName} already exists. Enable automatic indexing via withDevTools('${storeName}', { indexNames: true }), or rename it upon instantiation.`);
      }
    }
    for (let i = 1; names.includes(storeName); i++) {
      storeName = `${name}-${i}`;
    }
    this.#stores[id] = {
      name: storeName,
      options
    };
    const tracker = options.tracker;
    if (!this.#trackers.includes(tracker)) {
      this.#trackers.push(tracker);
    }
    tracker.onChange((changedState) => this.syncToDevTools(changedState));
    tracker.track(id, store);
  }
  removeStore(id) {
    const name = this.#stores[id].name;
    this.#stores = Object.entries(this.#stores).reduce((newStore, [storeId, value]) => {
      if (storeId !== id) {
        newStore[storeId] = value;
      }
      return newStore;
    }, {});
    this.#currentState = Object.entries(this.#currentState).reduce((newState, [storeName, state]) => {
      if (storeName !== name) {
        newState[name] = state;
      }
      return newState;
    }, {});
    for (const tracker of this.#trackers) {
      tracker.removeStore(id);
    }
  }
  renameStore(oldName, newName) {
    const storeNames = Object.values(this.#stores).map((store) => store.name);
    const id = throwIfNull(Object.keys(this.#stores).find((id2) => this.#stores[id2].name === oldName));
    if (storeNames.includes(newName)) {
      throw new Error(`NgRx Toolkit/DevTools: cannot rename from ${oldName} to ${newName}. ${newName} is already assigned to another SignalStore instance.`);
    }
    this.#stores = Object.entries(this.#stores).reduce((newStore, [id2, value]) => {
      if (value.name === oldName) {
        newStore[id2] = __spreadProps(__spreadValues({}, value), {
          name: newName
        });
      } else {
        newStore[id2] = value;
      }
      return newStore;
    }, {});
    this.#currentState = Object.entries(this.#currentState).reduce((newState, [storeName, state]) => {
      if (storeName !== oldName) {
        newState[storeName] = state;
      }
      return newState;
    }, {});
    this.#trackers.forEach((tracker) => tracker.notifyRenamedStore(id));
  }
  static {
    this.ɵfac = function DevtoolsSyncer_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DevtoolsSyncer)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _DevtoolsSyncer,
      factory: _DevtoolsSyncer.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DevtoolsSyncer, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var DefaultTracker = class _DefaultTracker {
  #stores = signal({});
  get stores() {
    return this.#stores();
  }
  #trackCallback;
  #trackingEffect = effect(() => {
    if (this.#trackCallback === void 0) {
      throw new Error("no callback function defined");
    }
    const stores = this.#stores();
    const fullState = Object.entries(stores).reduce((acc, [id, store]) => {
      return __spreadProps(__spreadValues({}, acc), {
        [id]: getState(store)
      });
    }, {});
    this.#trackCallback(fullState);
  });
  track(id, store) {
    this.#stores.update((value) => __spreadProps(__spreadValues({}, value), {
      [id]: store
    }));
  }
  onChange(callback) {
    this.#trackCallback = callback;
  }
  removeStore(id) {
    this.#stores.update((stores) => Object.entries(stores).reduce((newStore, [storeId, state]) => {
      if (storeId !== id) {
        newStore[storeId] = state;
      }
      return newStore;
    }, {}));
  }
  notifyRenamedStore(id) {
    if (this.#stores()[id]) {
      this.#stores.update((stores) => {
        return __spreadValues({}, stores);
      });
    }
  }
  static {
    this.ɵfac = function DefaultTracker_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DefaultTracker)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _DefaultTracker,
      factory: _DefaultTracker.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultTracker, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var renameDevtoolsMethodName = "___renameDevtoolsName";
var uniqueDevtoolsId = "___uniqueDevtoolsId";
var EXISTING_NAMES = new InjectionToken("Array contain existing names for the signal stores", {
  factory: () => [],
  providedIn: "root"
});
function withDevtools(name, ...features) {
  return signalStoreFeature(withMethods(() => {
    const syncer = inject(DevtoolsSyncer);
    const id = syncer.getNextId();
    return {
      [renameDevtoolsMethodName]: (newName) => {
        syncer.renameStore(name, newName);
      },
      [uniqueDevtoolsId]: () => id
    };
  }), withHooks((store) => {
    const syncer = inject(DevtoolsSyncer);
    const id = String(store[uniqueDevtoolsId]());
    return {
      onInit() {
        const id2 = String(store[uniqueDevtoolsId]());
        const finalOptions = {
          indexNames: !features.some((f) => f.indexNames === false),
          map: features.find((f) => f.map)?.map ?? ((state) => state),
          tracker: inject(features.find((f) => f.tracker)?.tracker || DefaultTracker)
        };
        syncer.addStore(id2, name, store, finalOptions);
      },
      onDestroy() {
        syncer.removeStore(id);
      }
    };
  }));
}
var DEVTOOLS_FEATURE = Symbol("DEVTOOLS_FEATURE");
function createDevtoolsFeature(options) {
  return __spreadValues({
    [DEVTOOLS_FEATURE]: true
  }, options);
}
function withDisabledNameIndices() {
  return createDevtoolsFeature({
    indexNames: false
  });
}
function withMapper(map) {
  return createDevtoolsFeature({
    map
  });
}
var GlitchTrackerService = class _GlitchTrackerService {
  #stores = {};
  #callback;
  get stores() {
    return Object.entries(this.#stores).reduce((acc, [id, {
      store
    }]) => {
      acc[id] = store;
      return acc;
    }, {});
  }
  onChange(callback) {
    this.#callback = callback;
  }
  removeStore(id) {
    this.#stores = Object.entries(this.#stores).reduce((newStore, [storeId, value]) => {
      if (storeId !== id) {
        newStore[storeId] = value;
      } else {
        value.destroyWatcher();
      }
      return newStore;
    }, {});
    throwIfNull(this.#callback)({});
  }
  track(id, store) {
    const watcher = watchState(store, (state) => {
      throwIfNull(this.#callback)({
        [id]: state
      });
    });
    this.#stores[id] = {
      destroyWatcher: watcher.destroy,
      store
    };
  }
  notifyRenamedStore(id) {
    if (Object.keys(this.#stores).includes(id) && this.#callback) {
      this.#callback({
        [id]: getState(this.#stores[id].store)
      });
    }
  }
  static {
    this.ɵfac = function GlitchTrackerService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _GlitchTrackerService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _GlitchTrackerService,
      factory: _GlitchTrackerService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlitchTrackerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function withGlitchTracking() {
  return createDevtoolsFeature({
    tracker: GlitchTrackerService
  });
}
var patchState2 = (state, action, ...rest) => {
  updateState(state, action, ...rest);
};
function updateState(stateSource, action, ...updaters) {
  currentActionNames.add(action);
  return patchState(stateSource, ...updaters);
}
function renameDevtoolsName(store, newName) {
  const renameMethod = store[renameDevtoolsMethodName];
  if (!renameMethod) {
    throw new Error("Devtools extensions haven't been added to this store.");
  }
  renameMethod(newName);
}
function assertActionFnSpecs(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("%o is not an Action Specification");
  }
}
function payload() {
  return {};
}
var noPayload = {};
function createReducer(reducerFactory) {
  return reducerFactory;
}
function createEffects(actions, effectsFactory) {
  return effectsFactory;
}
function createActionFns(actionFnSpecs, reducerRegistry, effectsRegistry, state) {
  const actionFns = {};
  for (const type in actionFnSpecs) {
    const actionFn = (payload2) => {
      const fullPayload = __spreadProps(__spreadValues({}, payload2), {
        type
      });
      const reducer = reducerRegistry[type];
      if (reducer) {
        reducer(state, fullPayload);
      }
      const effectSubjects = effectsRegistry[type];
      if (effectSubjects?.length) {
        for (const effectSubject of effectSubjects) {
          effectSubject.next(fullPayload);
        }
      }
      return fullPayload;
    };
    actionFn.type = type.toString();
    actionFns[type] = actionFn;
  }
  return actionFns;
}
function createPublicAndAllActionsFns(actionFnSpecs, reducerRegistry, effectsRegistry, state) {
  if ("public" in actionFnSpecs || "private" in actionFnSpecs) {
    const privates = actionFnSpecs["private"] || {};
    const publics = actionFnSpecs["public"] || {};
    assertActionFnSpecs(privates);
    assertActionFnSpecs(publics);
    const privateActionFns = createActionFns(privates, reducerRegistry, effectsRegistry, state);
    const publicActionFns = createActionFns(publics, reducerRegistry, effectsRegistry, state);
    return {
      all: __spreadValues(__spreadValues({}, privateActionFns), publicActionFns),
      publics: publicActionFns
    };
  }
  const actionFns = createActionFns(actionFnSpecs, reducerRegistry, effectsRegistry, state);
  return {
    all: actionFns,
    publics: actionFns
  };
}
function fillReducerRegistry(reducer, actionFns, reducerRegistry) {
  function on(action, reducerFn) {
    reducerRegistry[action.type] = reducerFn;
  }
  reducer(actionFns, on);
  return reducerRegistry;
}
function fillEffects(effects, actionFns, effectsRegistry = {}) {
  function create(action) {
    const subject = new Subject();
    if (!(action.type in effectsRegistry)) {
      effectsRegistry[action.type] = [];
    }
    effectsRegistry[action.type].push(subject);
    return subject.asObservable();
  }
  const effectObservables = effects(actionFns, create);
  return Object.values(effectObservables);
}
function startSubscriptions(observables) {
  return observables.map((observable) => observable.subscribe());
}
function processRedux(actionFnSpecs, reducer, effects, store) {
  const reducerRegistry = {};
  const effectsRegistry = {};
  const actionsMap = createPublicAndAllActionsFns(actionFnSpecs, reducerRegistry, effectsRegistry, store);
  const actionFns = actionsMap.all;
  const publicActionsFns = actionsMap.publics;
  fillReducerRegistry(reducer, actionFns, reducerRegistry);
  const effectObservables = fillEffects(effects, actionFns, effectsRegistry);
  const subscriptions = startSubscriptions(effectObservables);
  return {
    methods: publicActionsFns,
    subscriptions
  };
}
function withRedux(redux) {
  return (store) => {
    const {
      methods
    } = processRedux(redux.actions, redux.reducer, redux.effects, store);
    return __spreadProps(__spreadValues({}, store), {
      methods: __spreadValues(__spreadValues({}, store.methods), methods)
    });
  };
}
function getCallStateKeys(config) {
  const prop = config?.collection;
  return {
    callStateKey: prop ? `${config.collection}CallState` : "callState",
    loadingKey: prop ? `${config.collection}Loading` : "loading",
    loadedKey: prop ? `${config.collection}Loaded` : "loaded",
    errorKey: prop ? `${config.collection}Error` : "error"
  };
}
function withCallState(config) {
  const {
    callStateKey,
    errorKey,
    loadedKey,
    loadingKey
  } = getCallStateKeys(config);
  return signalStoreFeature(withState({
    [callStateKey]: "init"
  }), withComputed((state) => {
    const callState = state[callStateKey];
    return {
      [loadingKey]: computed(() => callState() === "loading"),
      [loadedKey]: computed(() => callState() === "loaded"),
      [errorKey]: computed(() => {
        const v = callState();
        return typeof v === "object" ? v.error : null;
      })
    };
  }));
}
function setLoading(prop) {
  if (prop) {
    return {
      [`${prop}CallState`]: "loading"
    };
  }
  return {
    callState: "loading"
  };
}
function setLoaded(prop) {
  if (prop) {
    return {
      [`${prop}CallState`]: "loaded"
    };
  } else {
    return {
      callState: "loaded"
    };
  }
}
function setError(error, prop) {
  let errorMessage;
  if (!error) {
    errorMessage = "";
  } else if (typeof error === "object" && "message" in error) {
    errorMessage = String(error.message);
  } else {
    errorMessage = String(error);
  }
  if (prop) {
    return {
      [`${prop}CallState`]: {
        error: errorMessage
      }
    };
  } else {
    return {
      callState: {
        error: errorMessage
      }
    };
  }
}
function capitalize(str) {
  return str ? str[0].toUpperCase() + str.substring(1) : str;
}
function getDataServiceKeys(options) {
  const filterKey = options.collection ? `${options.collection}Filter` : "filter";
  const selectedIdsKey = options.collection ? `selected${capitalize(options.collection)}Ids` : "selectedIds";
  const selectedEntitiesKey = options.collection ? `selected${capitalize(options.collection)}Entities` : "selectedEntities";
  const updateFilterKey = options.collection ? `update${capitalize(options.collection)}Filter` : "updateFilter";
  const updateSelectedKey = options.collection ? `updateSelected${capitalize(options.collection)}Entities` : "updateSelected";
  const loadKey = options.collection ? `load${capitalize(options.collection)}Entities` : "load";
  const currentKey = options.collection ? `current${capitalize(options.collection)}` : "current";
  const loadByIdKey = options.collection ? `load${capitalize(options.collection)}ById` : "loadById";
  const setCurrentKey = options.collection ? `setCurrent${capitalize(options.collection)}` : "setCurrent";
  const createKey = options.collection ? `create${capitalize(options.collection)}` : "create";
  const updateKey = options.collection ? `update${capitalize(options.collection)}` : "update";
  const updateAllKey = options.collection ? `updateAll${capitalize(options.collection)}` : "updateAll";
  const deleteKey = options.collection ? `delete${capitalize(options.collection)}` : "delete";
  const entitiesKey = options.collection ? `${options.collection}Entities` : "entities";
  const entityMapKey = options.collection ? `${options.collection}EntityMap` : "entityMap";
  const idsKey = options.collection ? `${options.collection}Ids` : "ids";
  return {
    filterKey,
    selectedIdsKey,
    selectedEntitiesKey,
    updateFilterKey,
    updateSelectedKey,
    loadKey,
    entitiesKey,
    entityMapKey,
    idsKey,
    currentKey,
    loadByIdKey,
    setCurrentKey,
    createKey,
    updateKey,
    updateAllKey,
    deleteKey
  };
}
function withDataService(options) {
  const {
    dataServiceType,
    filter,
    collection: prefix
  } = options;
  const {
    entitiesKey,
    filterKey,
    loadKey,
    selectedEntitiesKey,
    selectedIdsKey,
    updateFilterKey,
    updateSelectedKey,
    currentKey,
    createKey,
    updateKey,
    updateAllKey,
    deleteKey,
    loadByIdKey,
    setCurrentKey
  } = getDataServiceKeys(options);
  const {
    callStateKey
  } = getCallStateKeys({
    collection: prefix
  });
  return signalStoreFeature(withState(() => ({
    [filterKey]: filter,
    [selectedIdsKey]: {},
    [currentKey]: void 0
  })), withComputed((store) => {
    const entities = store[entitiesKey];
    const selectedIds = store[selectedIdsKey];
    return {
      [selectedEntitiesKey]: computed(() => entities().filter((e) => selectedIds()[e.id]))
    };
  }), withMethods((store) => {
    const dataService = inject(dataServiceType);
    return {
      [updateFilterKey]: (filter2) => {
        patchState(store, {
          [filterKey]: filter2
        });
      },
      [updateSelectedKey]: (id, selected) => {
        patchState(store, (state) => ({
          [selectedIdsKey]: __spreadProps(__spreadValues({}, state[selectedIdsKey]), {
            [id]: selected
          })
        }));
      },
      [loadKey]: () => __async(this, null, function* () {
        const filter2 = store[filterKey];
        (() => store[callStateKey] && patchState(store, setLoading(prefix)))();
        try {
          const result = yield dataService.load(filter2());
          patchState(store, prefix ? setAllEntities(result, {
            collection: prefix
          }) : setAllEntities(result));
          (() => store[callStateKey] && patchState(store, setLoaded(prefix)))();
        } catch (e) {
          (() => store[callStateKey] && patchState(store, setError(e, prefix)))();
          throw e;
        }
      }),
      [loadByIdKey]: (id) => __async(this, null, function* () {
        (() => store[callStateKey] && patchState(store, setLoading(prefix)))();
        try {
          const current = yield dataService.loadById(id);
          (() => store[callStateKey] && patchState(store, setLoaded(prefix)))();
          patchState(store, {
            [currentKey]: current
          });
        } catch (e) {
          (() => store[callStateKey] && patchState(store, setError(e, prefix)))();
          throw e;
        }
      }),
      [setCurrentKey]: (current) => {
        patchState(store, {
          [currentKey]: current
        });
      },
      [createKey]: (entity) => __async(this, null, function* () {
        patchState(store, {
          [currentKey]: entity
        });
        (() => store[callStateKey] && patchState(store, setLoading(prefix)))();
        try {
          const created = yield dataService.create(entity);
          patchState(store, {
            [currentKey]: created
          });
          patchState(store, prefix ? addEntity(created, {
            collection: prefix
          }) : addEntity(created));
          (() => store[callStateKey] && patchState(store, setLoaded(prefix)))();
        } catch (e) {
          (() => store[callStateKey] && patchState(store, setError(e, prefix)))();
          throw e;
        }
      }),
      [updateKey]: (entity) => __async(this, null, function* () {
        patchState(store, {
          [currentKey]: entity
        });
        (() => store[callStateKey] && patchState(store, setLoading(prefix)))();
        try {
          const updated = yield dataService.update(entity);
          patchState(store, {
            [currentKey]: updated
          });
          const updateArg = {
            id: updated.id,
            changes: updated
          };
          const updater = (collection) => updateEntity(updateArg, {
            collection
          });
          patchState(store, prefix ? updater(prefix) : updateEntity(updateArg));
          (() => store[callStateKey] && patchState(store, setLoaded(prefix)))();
        } catch (e) {
          (() => store[callStateKey] && patchState(store, setError(e, prefix)))();
          throw e;
        }
      }),
      [updateAllKey]: (entities) => __async(this, null, function* () {
        (() => store[callStateKey] && patchState(store, setLoading(prefix)))();
        try {
          const result = yield dataService.updateAll(entities);
          patchState(store, prefix ? setAllEntities(result, {
            collection: prefix
          }) : setAllEntities(result));
          (() => store[callStateKey] && patchState(store, setLoaded(prefix)))();
        } catch (e) {
          (() => store[callStateKey] && patchState(store, setError(e, prefix)))();
          throw e;
        }
      }),
      [deleteKey]: (entity) => __async(this, null, function* () {
        patchState(store, {
          [currentKey]: entity
        });
        (() => store[callStateKey] && patchState(store, setLoading(prefix)))();
        try {
          yield dataService.delete(entity);
          patchState(store, {
            [currentKey]: void 0
          });
          patchState(store, prefix ? removeEntity(entity.id, {
            collection: prefix
          }) : removeEntity(entity.id));
          (() => store[callStateKey] && patchState(store, setLoaded(prefix)))();
        } catch (e) {
          (() => store[callStateKey] && patchState(store, setError(e, prefix)))();
          throw e;
        }
      })
    };
  }));
}
var defaultOptions = {
  maxStackSize: 100,
  keys: [],
  skip: 0
};
function getUndoRedoKeys(collections) {
  if (collections) {
    return collections.flatMap((c) => [`${c}EntityMap`, `${c}Ids`, `selected${capitalize(c)}Ids`, `${c}Filter`]);
  }
  return ["entityMap", "ids", "selectedIds", "filter"];
}
function withUndoRedo(options) {
  let previous = null;
  let skipOnce = false;
  const normalized = __spreadValues(__spreadValues({}, defaultOptions), options);
  const undoStack = [];
  const redoStack = [];
  const canUndo = signal(false);
  const canRedo = signal(false);
  const updateInternal = () => {
    canUndo.set(undoStack.length !== 0);
    canRedo.set(redoStack.length !== 0);
  };
  const keys = [...getUndoRedoKeys(normalized.collections), ...normalized.keys];
  return signalStoreFeature(withComputed(() => ({
    canUndo: canUndo.asReadonly(),
    canRedo: canRedo.asReadonly()
  })), withMethods((store) => ({
    undo() {
      const item = undoStack.pop();
      if (item && previous) {
        redoStack.push(previous);
      }
      if (item) {
        skipOnce = true;
        patchState(store, item);
        previous = item;
      }
      updateInternal();
    },
    redo() {
      const item = redoStack.pop();
      if (item && previous) {
        undoStack.push(previous);
      }
      if (item) {
        skipOnce = true;
        patchState(store, item);
        previous = item;
      }
      updateInternal();
    },
    clearStack() {
      undoStack.splice(0);
      redoStack.splice(0);
      updateInternal();
    }
  })), withHooks({
    onInit(store) {
      effect(() => {
        const cand = keys.reduce((acc, key) => {
          const s = store[key];
          if (s && isSignal(s)) {
            return __spreadProps(__spreadValues({}, acc), {
              [key]: s()
            });
          }
          return acc;
        }, {});
        if (normalized.skip > 0) {
          normalized.skip--;
          return;
        }
        if (skipOnce) {
          skipOnce = false;
          return;
        }
        if (JSON.stringify(cand) === JSON.stringify(previous)) {
          return;
        }
        redoStack.splice(0);
        if (previous) {
          undoStack.push(previous);
        }
        if (redoStack.length > normalized.maxStackSize) {
          undoStack.unshift();
        }
        previous = cand;
        untracked(() => updateInternal());
      });
    }
  }));
}
var NOOP = () => void 0;
var StorageSyncStub = {
  clearStorage: NOOP,
  readFromStorage: NOOP,
  writeToStorage: NOOP
};
function withStorageSync(configOrKey) {
  const {
    key,
    autoSync = true,
    select = (state) => state,
    parse = JSON.parse,
    stringify = JSON.stringify,
    storage: storageFactory = () => localStorage
  } = typeof configOrKey === "string" ? {
    key: configOrKey
  } : configOrKey;
  return signalStoreFeature(withMethods((store, platformId = inject(PLATFORM_ID)) => {
    if (isPlatformServer(platformId)) {
      console.warn(`'withStorageSync' provides non-functional implementation due to server-side execution`);
      return StorageSyncStub;
    }
    const storage = storageFactory();
    return {
      /**
       * Removes the item stored in storage.
       */
      clearStorage() {
        storage.removeItem(key);
      },
      /**
       * Reads item from storage and patches the state.
       */
      readFromStorage() {
        const stateString = storage.getItem(key);
        if (stateString) {
          patchState(store, parse(stateString));
        }
      },
      /**
       * Writes selected portion to storage.
       */
      writeToStorage() {
        const slicedState = select(getState(store));
        storage.setItem(key, stringify(slicedState));
      }
    };
  }), withHooks({
    onInit(store, platformId = inject(PLATFORM_ID)) {
      if (isPlatformServer(platformId)) {
        return;
      }
      if (autoSync) {
        store.readFromStorage();
        effect(() => {
          store.writeToStorage();
        });
      }
    }
  }));
}
function withPagination(options) {
  const {
    pageKey,
    pageSizeKey,
    entitiesKey,
    selectedPageEntitiesKey,
    totalCountKey,
    pageCountKey,
    pageNavigationArrayMaxKey,
    pageNavigationArrayKey,
    hasNextPageKey,
    hasPreviousPageKey
  } = createPaginationKeys(options);
  return signalStoreFeature(withState({
    [pageKey]: 0,
    [pageSizeKey]: 10,
    [pageNavigationArrayMaxKey]: 7
  }), withComputed((store) => {
    const entities = store[entitiesKey];
    const page = store[pageKey];
    const pageSize = store[pageSizeKey];
    const pageNavigationArrayMax = store[pageNavigationArrayMaxKey];
    return {
      // The derived enitites which are displayed on the current page
      [selectedPageEntitiesKey]: computed(() => {
        const pageSizeValue = pageSize();
        const pageValue = page();
        return entities().slice(pageValue * pageSizeValue, (pageValue + 1) * pageSizeValue);
      }),
      [totalCountKey]: computed(() => entities().length),
      [pageCountKey]: computed(() => {
        const totalCountValue = entities().length;
        const pageSizeValue = pageSize();
        if (totalCountValue === 0) {
          return 0;
        }
        return Math.ceil(totalCountValue / pageSizeValue);
      }),
      [pageNavigationArrayKey]: computed(() => createPageArray(page(), pageSize(), entities().length, pageNavigationArrayMax())),
      [hasNextPageKey]: computed(() => {
        return page() < pageSize();
      }),
      [hasPreviousPageKey]: computed(() => {
        return page() > 1;
      })
    };
  }));
}
function gotoPage(page, options) {
  const {
    pageKey
  } = createPaginationKeys(options);
  return {
    [pageKey]: page
  };
}
function setPageSize(pageSize, options) {
  const {
    pageSizeKey
  } = createPaginationKeys(options);
  return {
    [pageSizeKey]: pageSize
  };
}
function nextPage(options) {
  const {
    pageKey
  } = createPaginationKeys(options);
  return {
    [pageKey]: (currentPage) => currentPage + 1
  };
}
function previousPage(options) {
  const {
    pageKey
  } = createPaginationKeys(options);
  return {
    [pageKey]: (currentPage) => Math.max(currentPage - 1, 1)
  };
}
function firstPage(options) {
  const {
    pageKey
  } = createPaginationKeys(options);
  return {
    [pageKey]: 1
  };
}
function setMaxPageNavigationArrayItems(maxPageNavigationArrayItems, options) {
  const {
    pageNavigationArrayMaxKey
  } = createPaginationKeys(options);
  return {
    [pageNavigationArrayMaxKey]: maxPageNavigationArrayItems
  };
}
function createPaginationKeys(options) {
  const entitiesKey = options?.collection ? `${options.collection}Entities` : "entities";
  const selectedPageEntitiesKey = options?.collection ? `selectedPage${capitalize(options?.collection)}Entities` : "selectedPageEntities";
  const pageKey = options?.collection ? `${options.collection}CurrentPage` : "currentPage";
  const pageSizeKey = options?.collection ? `${options.collection}PageSize` : "pageSize";
  const totalCountKey = options?.collection ? `${options.collection}TotalCount` : "totalCount";
  const pageCountKey = options?.collection ? `${options.collection}PageCount` : "pageCount";
  const pageNavigationArrayMaxKey = options?.collection ? `${options.collection}PageNavigationArrayMax` : "pageNavigationArrayMax";
  const pageNavigationArrayKey = options?.collection ? `${options.collection}PageNavigationArray` : "pageNavigationArray";
  const hasNextPageKey = options?.collection ? `hasNext${capitalize(options.collection)}Page` : "hasNextPage";
  const hasPreviousPageKey = options?.collection ? `hasPrevious${capitalize(options.collection)}Page` : "hasPreviousPage";
  return {
    pageKey,
    pageSizeKey,
    entitiesKey,
    selectedPageEntitiesKey,
    totalCountKey,
    pageCountKey,
    pageNavigationArrayKey,
    pageNavigationArrayMaxKey,
    hasNextPageKey,
    hasPreviousPageKey
  };
}
function createPageArray(currentPage, itemsPerPage, totalItems, paginationRange) {
  paginationRange = +paginationRange;
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
  const halfWay = Math.ceil(paginationRange / 2);
  const isStart = currentPage <= halfWay;
  const isEnd = totalPages - halfWay < currentPage;
  const isMiddle = !isStart && !isEnd;
  const ellipsesNeeded = paginationRange < totalPages;
  const pages = [];
  for (let i = 1; i <= totalPages && i <= paginationRange; i++) {
    let pageNumber = i;
    if (i === paginationRange) {
      pageNumber = totalPages;
    } else if (ellipsesNeeded) {
      if (isEnd) {
        pageNumber = totalPages - paginationRange + i;
      } else if (isMiddle) {
        pageNumber = currentPage - halfWay + i;
      }
    }
    const openingEllipsesNeeded = i === 2 && (isMiddle || isEnd);
    const closingEllipsesNeeded = i === paginationRange - 1 && (isMiddle || isStart);
    const label = ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded) ? "..." : pageNumber;
    pages.push({
      label,
      value: pageNumber
    });
  }
  return pages;
}
function withReset() {
  return signalStoreFeature(withProps(() => ({
    _resetState: {
      value: {}
    }
  })), withMethods((store) => {
    const methods = {
      resetState() {
        patchState(store, store._resetState.value);
      },
      __setResetState__(state) {
        store._resetState.value = state;
      }
    };
    return methods;
  }), withHooks((store) => ({
    onInit() {
      store._resetState.value = getState(store);
    }
  })));
}
function setResetState(store, state) {
  if (!("__setResetState__" in store)) {
    throw new Error("Cannot set reset state, since store is not configured with withReset()");
  }
  store.__setResetState__(state);
}
function deepFreeze(target, propertyNamesToBeFrozen, isRoot = true) {
  const runPropertyNameCheck = propertyNamesToBeFrozen.length > 0;
  for (const key of Reflect.ownKeys(target)) {
    if (runPropertyNameCheck && !propertyNamesToBeFrozen.includes(key)) {
      continue;
    }
    const propValue = target[key];
    if (isRecordLike(propValue) && !Object.isFrozen(propValue)) {
      Object.freeze(propValue);
      deepFreeze(propValue, [], false);
    } else if (isRoot) {
      Object.defineProperty(target, key, {
        value: propValue,
        writable: false,
        configurable: false
      });
    }
  }
}
function isRecordLike(target) {
  return typeof target === "object" && target !== null;
}
function isDevMode2() {
  return isDevMode();
}
function withImmutableState(stateOrFactory, options) {
  const immutableState = typeof stateOrFactory === "function" ? stateOrFactory() : stateOrFactory;
  const stateKeys = Reflect.ownKeys(immutableState);
  const applyFreezing = isDevMode2() || options?.enableInProduction === true;
  return signalStoreFeature(withState(immutableState), withHooks((store) => ({
    onInit() {
      if (!applyFreezing) {
        return;
      }
      Object.freeze(immutableState);
      watchState(store, (state) => {
        deepFreeze(state, stateKeys);
      });
    }
  })));
}
function withFeatureFactory(factoryFn) {
  return (store) => {
    const storeForFactory = __spreadValues(__spreadValues(__spreadValues({}, store["stateSignals"]), store["props"]), store["methods"]);
    const feature = factoryFn(storeForFactory);
    return feature(store);
  };
}
function withConditional(condition, featureIfTrue, featureIfFalse) {
  return (store) => {
    const conditionStore = __spreadValues(__spreadValues(__spreadValues({}, store["stateSignals"]), store["props"]), store["methods"]);
    return condition(conditionStore) ? featureIfTrue(store) : featureIfFalse(store);
  };
}
var emptyFeature = signalStoreFeature(withState({}));
export {
  capitalize,
  createEffects,
  createPageArray,
  createReducer,
  emptyFeature,
  firstPage,
  getCallStateKeys,
  getDataServiceKeys,
  getUndoRedoKeys,
  gotoPage,
  nextPage,
  noPayload,
  patchState2 as patchState,
  payload,
  previousPage,
  renameDevtoolsName,
  setError,
  setLoaded,
  setLoading,
  setMaxPageNavigationArrayItems,
  setPageSize,
  setResetState,
  updateState,
  withCallState,
  withConditional,
  withDataService,
  withDevToolsStub,
  withDevtools,
  withDisabledNameIndices,
  withFeatureFactory,
  withGlitchTracking,
  withImmutableState,
  withMapper,
  withPagination,
  withRedux,
  withReset,
  withStorageSync,
  withUndoRedo
};
//# sourceMappingURL=@angular-architects_ngrx-toolkit.js.map
