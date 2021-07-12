import 'dart:html';
import 'package:dart_components/h.dart';

class Component {
  String name;
  String template;
  Map<String, String> style;
  Component() {
    for (var elem in querySelectorAll(this.name)) {
      elem.classes.add(this.name);
      elem.innerHtml = this.template;
    }
    final styleTag = querySelector("#__component_styles");
    if (styleTag == null) {
      var styleElement = new StyleElement();
      this.style.forEach((k, v) {
        styleElement.text += ".${this.name} $k{$v}";
      });
      styleElement.id = "__component_styles";
      document.head.insertAdjacentElement("beforeend", styleElement);
    } else {
      this.style.forEach((k, v) {
        styleTag.text += ".${this.name} $k{$v}";
      });
    }
  }
}

class KoolButtonComponent extends Component {
  String name = "kool-button";
  String template = """
  <button>Koolness</button>
  """;
  Map<String, String> style = {"button": "font-size: 30px;"};
}

class KoolInputComponent extends Component {
  String name = "kool-input";
  String template = h("input", {"type": "text"}, []);
  Map<String, String> style = {"input": "color: red;"};
}
