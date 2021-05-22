import React, { FormEvent, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import {
  FormControl,
  FilledInput,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  useMediaQuery,
  IconButton,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { Search } from "@material-ui/icons";

function Debouncer(time: number) {
  let timeout: NodeJS.Timeout;
  return (func: () => void) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(func, time);
  };
}

const debounce = Debouncer(200);

export default function SearchBar({
  small = false,
  query,
  setQuery,
  className = "",
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const smallScreen = useMediaQuery("(max-width: 800px)");
  const inputRef = useRef<HTMLDivElement>();

  function handleInput(event: FormEvent) {
    setQuery((event.target as HTMLInputElement).value);
    if (!smallScreen)
      debounce(() => {
        router.push(`/search?q=${(event.target as HTMLInputElement).value}`);
      });
  }

  function handleSubmit(event?: FormEvent) {
    if (event) event.preventDefault();
    router.push(`/search?q=${query}`);
  }

  const searchAdornment = (
    <InputAdornment position="end">
      <IconButton
        style={{ marginRight: -12 }}
        onClick={() => handleSubmit()}
        aria-label="Search"
      >
        <Search />
      </IconButton>
    </InputAdornment>
  );

  useEffect(() => {
    if (router.route.startsWith("/search")) {
      inputRef.current.getElementsByTagName("input")[0].focus();
    }
  }, [router.route]);

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      className={className}
    >
      {/* ESLint is broken here */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="search" style={{ display: "none" }}>
        {t("searchText")}
      </label>
      {small ? (
        <FormControl variant="outlined" size="small">
          <OutlinedInput
            id="search"
            onInput={handleInput}
            value={query}
            placeholder={t("searchText")}
            endAdornment={searchAdornment}
            ref={inputRef}
          />
        </FormControl>
      ) : (
        <FormControl variant="filled" style={{ width: "100%" }} size="medium">
          <>
            <InputLabel>{t("searchText")}</InputLabel>
            <FilledInput
              id="search"
              onInput={handleInput}
              endAdornment={searchAdornment}
              value={query}
            />
          </>
        </FormControl>
      )}
    </form>
  );
}
