// // Reactは人間に書きやすいようにこのように書いている
// const MyComponent = () => {
//   return <h1 title="foo">Hello</h1>;
// };

// const container = document.getElementById("root");
// ReactDOM.render = ((<MyComponent />), container);

// ReactはうらでViteなどをつかって1~3行目のJSX以下のようなJSに変換している
// const element = React.createElement("h1", { title: "foo" }, "Hello");

// // createElementすると以下のようなオブジェクトが返ってくる
// const element = {
//   type: "h1",
//   props: {
//     title: "foo",
//     children: "Hello",
//   },
// };

// createElement関数の自作
const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child),
      ),
    },
  };
};

// createTextElement関数の自作
const createTextElement = (text) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const render = (element, container) => {
  // テキスト要素か否かで分岐
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element.props.nodeValue)
      : document.createElement(element.type);

  // propsのキーを取得して、childrenでなければ属性
  Object.keys(element.props)
    .filter((key) => key !== "children")
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
};

const MyReact = {
  createElement,
  render,
};

export default MyReact;

// このようにJSだけでは効率が悪い
// const element = createElement("h1", { title: "foo" }, "Hello");
// console.log(element);

// const container = document.getElementById("root");

// // elementオブジェクトを参考にHTML要素(h1)を作る
// const node = document.createElement(element.type);
// node["title"] = element.props.title;

// // h1のテキスト情報を作成
// const text = document.createTextNode("");
// text["nodeValue"] = element.props.children;

// // h1要素の子にテキスト情報を紐づける
// node.appendChild(text);

// // id=rootをもつHTML要素にh1要素をぶら下げる
// container.appendChild(node);

// ReactDOM.render(element, container);
