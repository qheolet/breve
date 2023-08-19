const MemoryHandler = () => {
 const _o: any = {};

  function add(url:string): {id: string} {
    const id = crypto.randomUUID()

    _o[id] = url;

    return {id}

  }


  function get(id: string): string{
    return _o[id]
  }


  return {
    add, get
  }

}


export const memory = MemoryHandler();