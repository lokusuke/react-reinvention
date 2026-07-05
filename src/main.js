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

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child),
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

// 追加
function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

// 追加
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let wipRoot = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

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
