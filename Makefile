# Private variables
obj = gnome-shell-extension-sticky-app@felicitas.pojtinger.com
all: $(addprefix build/,$(obj))

# Build
build: $(addprefix build/,$(obj))
$(addprefix build/,$(obj)):
	gnome-extensions pack --force

# Install
install: $(addprefix install/,$(obj))
$(addprefix install/,$(obj)):
	gnome-extensions install --force $(subst install/,,$@).shell-extension.zip

# Uninstall
uninstall: $(addprefix uninstall/,$(obj))
$(addprefix uninstall/,$(obj)):
	gnome-extensions uninstall $(subst uninstall/,,$@)

# Run
run: $(addprefix run/,$(obj))
$(addprefix run/,$(obj)): $(addprefix build/,$(obj)) $(addprefix install/,$(obj))
	gnome-extensions disable $(subst run/,,$@) || true
	gnome-extensions enable $(subst run/,,$@)
	dbus-run-session -- gnome-shell --nested --wayland

# Test
test: $(addprefix test/,$(obj))
$(addprefix test/,$(obj)):
	true

# Benchmark
benchmark: $(addprefix benchmark/,$(obj))
$(addprefix benchmark/,$(obj)):
	true

# Clean
clean: $(addprefix clean/,$(obj))
$(addprefix clean/,$(obj)):
	rm -f $(subst clean/,,$@).shell-extension.zip

# Dependencies
depend: $(addprefix depend/,$(obj))
$(addprefix depend/,$(obj)):
	true