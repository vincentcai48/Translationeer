import React, { useState } from "react";

const definition = {};

const lang = {
  language: "Latin to English",
  apis: [],
  textEnd: window.innerWidth,
  isAuth: false,
  updateApis: () => {},
  updateLanguage: () => {},
  updateTextEnd: () => {},
  updateIsAuth: () => {},
};

const LangContext = React.createContext(lang);

export { LangContext };
