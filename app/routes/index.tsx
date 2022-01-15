import React from "react";
import {
  useFetcher,
  useLoaderData,
  redirect
} from 'remix'

import type { LoaderFunction, ActionFunction } from "remix";

export default function Index() {
  const data = useLoaderData()
  const fetcher = useFetcher()

  return (<div></div>);
}
