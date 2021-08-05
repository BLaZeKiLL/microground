// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createElement = (id: string, tag: string, args: any = {}) : void => {
  const parent = document.getElementById(id);

  if (parent === null) throw new Error(`${id} not found`);

  if (customElements.get(tag) === undefined) throw new Error(`${tag} not defined`);

  const element = document.createElement(tag);

  Object.keys(args).forEach(key => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (element as any)[key] = args[key];
  });

  parent.appendChild(element);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createElementWhenDefined = async (id: string, tag: string, args: any = {}) : Promise<void> => {
  const parent = document.getElementById(id);

  if (parent === null) throw new Error(`${id} not found`);

  await customElements.whenDefined(tag);

  const element = document.createElement(tag);

  Object.keys(args).forEach(key => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (element as any)[key] = args[key];
  });

  parent.appendChild(element);
}
