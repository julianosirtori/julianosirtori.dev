// Browser stub for Node built-ins pulled transitively into the client graph by
// Next build utilities (e.g. next/dist/compiled/gzip-size requires fs/stream/zlib).
// These modules load but are never exercised on the preview render path.
const empty = new Proxy(
  {},
  {
    get: () => () => undefined,
  },
);
export default empty;
