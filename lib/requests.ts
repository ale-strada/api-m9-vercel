import { NextApiRequest, NextApiResponse } from "next";

// modifica el req para obtener un limit y un offset validos
export function getOffsetAndLimitFromReq(
  req: NextApiRequest,
  maxLimit,
  maxOffset
) {
  const queryLimit = parseInt(req.query.limit as string);
  const queryOffset = parseInt(req.query.offset as string);

  const limit = queryLimit <= maxLimit ? queryLimit : maxLimit;
  const offset = queryOffset < maxOffset ? queryOffset : 0;
  return {
    limit,
    offset,
  };
}
