defmodule History do
  def start do
    {:ok, agent} = Agent.start_link(fn -> %{} end, name: __MODULE__)
    agent
  end
  def scientists do
    %{
      "Aristotle" => "Created the geocentric theory",
      "Ptolemy" => "Expanded the geocentric theory",
      "Nicolaus Copernicus" => "Created the heliocentric theory",
      "Tycho Brahe" => "Collected data on the movements of planets",
      "Johannes Kepler" => "Expanded on Copernicus' heliocentric theory by proving that orbits are elliptical",
      "Galileo Galilei" => "Discovered that Jupiter has 4 moons and that the Earth and Sun have uneven surfaces; harrassed by the Catholic Church for supporting Copernicus",
      "Francis Bacon" => "Developed the scientific method based on experimentation",
      "René Descartes" => "Developed analytical geometry & proved things using math",
      "Isaac Newton" => "Developed modern physics; thought the world was like a clock",
      "Zacharias Janssen" => "Invented the microscope",
      "Anton van Leeuwenhoek" => "Observed bacteria through a microscope",
      "Evangelista Torricelli" => "Developed the mercury barometer",
      "Gabriel Fahrenheit" => "Developed the F temperature system",
      "Anders Celsius" => "Developed the C temperature system",
      "Galen" => "Ancient Greek physician who was wrong",
      "Andreas Vesalius" => "Developed modern anatomy",
      "Edward Jenner" => "Developed the first vaccine; it was for smallpox",
      "Robert Boyle" => "Developed modern chemistry; invented a law about gases"
    }
  end
  def flashcards(name, description) do
    IO.puts "==> #{description}"
    if name == IO.gets("Who did this? ") |> String.trim do
      IO.puts IO.ANSI.format([:green, "Correct!"])
      History.flashcards
    else
      Agent.update(__MODULE__, fn list -> Map.update(list, name, 1, &(&1 + 1)) end)
      times = Agent.get(__MODULE__, fn list -> list[name] end)
      IO.puts IO.ANSI.format([:light_red, "Incorrect; the correct answer is #{name}. This is the #{Ordinal.ordinalize(times)} time you missed this question."])
      IO.puts IO.ANSI.format([:light_white, History.look_up(name)])
      History.flashcards(name, description)
    end
  end
  def flashcards do
    {name, description} = History.scientists |> Enum.random
    History.flashcards(name, description)
  end
  def look_up(item) do
    HTTPoison.start
    %HTTPoison.Response{status_code: 200, body: body} = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=#{item}"
      |> URI.encode
      |> HTTPoison.get!
    results = Poison.decode!(body)["query"]["pages"]
    results[results |> Map.keys |> List.first]["extract"]
  end
end
