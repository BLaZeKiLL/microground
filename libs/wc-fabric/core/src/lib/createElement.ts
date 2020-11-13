export const createElement = (id: string, tag: string, args: any = {}) : void => {
  const parent = document.getElementById(id);

  if (parent === null) throw new Error(`${id} not found`);

  if (customElements.get(tag) === undefined) throw new Error(`${tag} not defined`);

  const element = document.createElement(tag);

  Object.keys(args).forEach(key => {
    (element as any)[key] = args[key];
  });

  parent.appendChild(element);
}

export const createElementWhenDefined = async (id: string, tag: string, args: any = {}) : Promise<void> => {
  const parent = document.getElementById(id);

  if (parent === null) throw new Error(`${id} not found`);

  await customElements.whenDefined(tag);

  const element = document.createElement(tag);

  Object.keys(args).forEach(key => {
    (element as any)[key] = args[key];
  });

  parent.appendChild(element);
}